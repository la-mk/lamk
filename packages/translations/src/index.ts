import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as gulp from 'gulp';
// @ts-ignore
import debug from 'gulp-debug';
import rimraf from 'rimraf';
import glob from 'glob';
import {
  get,
  defaultsDeep,
  merge,
  cloneDeep,
  isPlainObject,
  isString,
} from 'lodash';
// @ts-ignore
import scanner from 'i18next-scanner';

const asyncRimRaf = util.promisify(rimraf);
const asyncReadFile = util.promisify(fs.readFile);
const asyncWriteFile = util.promisify(fs.writeFile);
const asyncMkDir = util.promisify(fs.mkdir);
const asyncGlob = util.promisify(glob);

interface MainArgs {
  srcPaths: string[];
  localeFolderPath: string;
}

interface LocaleData {
  masterFilePath: string;
  destFilePath: string;
  content: any;
}

interface Locales {
  [lng: string]: LocaleData;
}

const ROOT_DESTINATION = './';
const NAMESPACE = 'translation';
const LANGUAGE = 'en';
const NOT_TRANSLATED_VALUE = '__STRING_NOT_TRANSLATED__';
const APPEND_NAMESPACES = ['enums'];

const defaultScannerConfig = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.ts', '.tsx'],
    },
    output: './',

    // There is no `trans` config as we don't use the `Trans` component.
    lngs: ['en', 'mk'],
    ns: [NAMESPACE],
    defaultLng: 'en',
    defaultNs: NAMESPACE,
    resource: {
      loadPath: 'i18n/{{lng}}/{{ns}}.json',
      savePath: 'i18n/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    defaultValue: NOT_TRANSLATED_VALUE,
    nsSeparator: false, // namespace separator
    keySeparator: '.', // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};

// This will always result in a single file due to the fact that we only specify a single language and namespace.
// The resulting file is temporary storage for all the existing keys in a project, and should be removed.
const scanTranslations = (srcPaths: MainArgs['srcPaths'], config: any) => {
  return new Promise((resolve, reject) => {
    gulp
      .src(srcPaths)
      // .pipe(debug({minimal: false}))
      .pipe(scanner(config))
      .pipe(gulp.dest(ROOT_DESTINATION))
      .on('error', reject)
      .on('end', resolve);
  });
};

const getFileJson = async (path: string) => {
  return JSON.parse(await asyncReadFile(path, 'utf8'));
};

const getScannedJson = async (fullDestinationLocalePath: string) => {
  return getFileJson(
    path.join(fullDestinationLocalePath, LANGUAGE, `${NAMESPACE}.json`)
  );
};

const writeContent = (locales: Locales) => {
  return Promise.all(
    Object.values(locales).map(async localeEntry => {
      await asyncMkDir(path.dirname(localeEntry.destFilePath), {
        recursive: true,
      });
      await asyncWriteFile(
        localeEntry.destFilePath,
        JSON.stringify(localeEntry.content, null, 2),
        { encoding: 'utf8' }
      );
    })
  );
};

const assignDeep = (
  obj: any,
  path: string,
  getData: (path: string) => string
) => {
  Object.keys(obj).forEach(key => {
    const ownPath = `${path}${path ? '.' : ''}${key}`;
    if (isPlainObject(obj[key])) {
      assignDeep(obj[key], ownPath, getData);
    }

    if (isString(obj[key])) {
      if (obj[key] === NOT_TRANSLATED_VALUE) {
        const data = getData(ownPath);
        if (!data) {
          throw new Error(
            `Translation missing in master files for key: ${ownPath}`
          );
        }

        obj[key] = data;
      }
    }
  });
};

const fillInMissing = (resLocale: any, masterLocale: any) => {
  const getData = (path: string) => {
    return get(masterLocale, path);
  };

  assignDeep(resLocale, '', getData);
};

const main = async ({ srcPaths, localeFolderPath }: MainArgs) => {
  const savePath = `${localeFolderPath}/{{lng}}/{{ns}}.json`;
  const scannerConfig = defaultsDeep(
    { resource: { savePath } },
    defaultScannerConfig
  );
  const fullDestinationLocalePath = path.join(
    ROOT_DESTINATION,
    localeFolderPath
  );

  console.log('Cleaning up the locale path if there is anything there...\n');
  await asyncRimRaf(fullDestinationLocalePath);

  console.log('Scanning source code for translations...\n');
  await scanTranslations(srcPaths, scannerConfig);

  console.log('Parsing the generated locale file...\n');
  const scannedJson = await getScannedJson(fullDestinationLocalePath);
  console.log(scannedJson, fullDestinationLocalePath);

  console.log('Cleaning up the generated locale file...\n');
  await asyncRimRaf(fullDestinationLocalePath);

  console.log('Fetching all master locale files...\n');
  const masterFilePaths = await asyncGlob(`${__dirname}/locales/**/*.json`);

  // Get a single namespace file per language (can be extended to multi-namespace setup later on).
  console.log('Generating content for the extracted translation keys...\n');
  const localeData = await masterFilePaths.reduce(
    async (locales: Promise<Locales>, filePath) => {
      const res = await locales;
      const ns = path.basename(filePath, '.json');
      const lng = path.basename(path.dirname(filePath));

      if (!res[lng]) {
        res[lng] = {
          masterFilePath: filePath,
          destFilePath: path.join(
            fullDestinationLocalePath,
            lng,
            `${NAMESPACE}.json`
          ),
          content: cloneDeep(scannedJson),
        };
      }

      const masterFileJson = await getFileJson(filePath);
      if (APPEND_NAMESPACES.includes(ns)) {
        merge(res[lng].content, masterFileJson);
      } else {
        fillInMissing(res[lng].content, masterFileJson);
      }

      return locales;
    },
    Promise.resolve({})
  );

  console.log('Writing locales to destination...\n');
  await writeContent(localeData);
};

const [srcPaths, localeFolderPath] = process.argv.slice(2);

main({ srcPaths: JSON.parse(srcPaths), localeFolderPath })
  .then(() => console.log('Success!'))
  .catch(console.error);
