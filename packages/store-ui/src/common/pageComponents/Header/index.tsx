import React from 'react';
import {
  Badge,
  Positioner,
  Box,
  Flex,
  Input,
  Image,
  hooks,
} from '@la-mk/blocks-ui';
import Link from 'next/link';
import queryString from 'qs';
import { ShoppingBag, ShoppingCart, Search, Briefcase } from 'react-feather';
import { useTheme } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { sdk } from '@la-mk/la-sdk';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { filterRouter, getFiltersFromSearch } from '../../filterUtils';
import { getCartCount } from '../../../state/modules/cart/cart.selector';
import { logout } from '../../../state/modules/auth/auth.module';
import { getUser } from '../../../state/modules/user/user.selector';
import { toggleAuthModal } from '../../../state/modules/ui/ui.module';
import { useTranslation } from '../../i18n';
import { NavButton } from './NavButton';
import { AccountMenu } from './AccountMenu';
import { Contact } from '../../../components/shared/Contact';

interface HeaderProps {
  store: Store;
}

export const Header = ({ store }: HeaderProps) => {
  const router = useRouter();
  const user = useSelector(getUser);
  const cartCount = useSelector(getCartCount);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const [filters] = hooks.useFilter(
    {},
    {
      storage: 'url',
      router: filterRouter,
    },
  );
  const [searchVal, setSearchVal] = React.useState(filters.searching ?? '');

  React.useEffect(() => {
    setSearchVal(filters.searching ?? '');
  }, [filters.searching]);

  const ownTheme = theme.sections.Header;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = () => {
    dispatch(toggleAuthModal(true));
  };

  const desktopHeight = Array.isArray(ownTheme.height)
    ? ownTheme.height[ownTheme.height.length - 1]
    : ownTheme.height;

  const presetSearch = (
    <Flex
      height={`calc(${desktopHeight} - 0.5rem)`}
      width='100%'
      align='center'
      justify='center'
    >
      <Input
        type='search'
        size='lg'
        value={searchVal}
        onChange={(_e, val: string) => setSearchVal(val)}
        onSearch={val => {
          // We don't want to preserve the existing parameters for now, see if this woseeld be an issue.
          const productsUrl = `/products?${queryString.stringify({
            // ...router.query,
            ...getFiltersFromSearch(val),
          })}`;

          router.push(productsUrl);
        }}
        placeholder={t('actions.search')}
      />
    </Flex>
  );

  const logo = (
    <Link href='/' passHref>
      <Box as='a' lineHeight={0}>
        <Box
          height={`calc(${desktopHeight} - 0.5rem)`}
          minWidth={`calc(${desktopHeight} - 0.5rem)`}
          m={1}
        >
          <Image
            getSrc={params =>
              sdk.artifact.getUrlForImage(store?.logo?._id, store?._id, params)
            }
            height={parseInt(desktopHeight)}
            alt='logo'
          />
        </Box>
      </Box>
    </Link>
  );

  return (
    <Flex
      as='nav'
      height={ownTheme.height}
      px={[3, 6, 7]}
      align='center'
      justify='center'
      // @ts-ignore
      border='1px solid #e8e8e8'
    >
      <Box width='100%'>
        <Flex justify='space-between' align='center'>
          {ownTheme.logo.position === 'center' && (
            <>
              <Flex
                direction='column'
                display={['none', 'flex', 'flex']}
                flex={1}
              >
                <Contact hideAlternate contact={store.contact} />
              </Flex>
              <Flex
                lineHeight={0}
                flex={1}
                align='center'
                justify={['flex-start', 'center', 'center']}
              >
                {logo}
              </Flex>
            </>
          )}

          {ownTheme.logo.position === 'left' && (
            <Box flex={1} lineHeight={0}>
              {logo}
            </Box>
          )}

          {ownTheme.menu.variant === 'full' && (
            <Box
              display={['none', 'block', 'block']}
              flex={1}
              minWidth='18rem'
              maxWidth='54rem'
              mx={[2, 3, 4]}
              my={1}
            >
              {presetSearch}
            </Box>
          )}

          <Flex align='center' justify='flex-end' flex={1}>
            {/* TODO: Either show it in a popover, or animate a focused input and hide on blur */}
            {ownTheme.menu.variant === 'minimal' && (
              <NavButton
                title={t('actions.search')}
                icon={<Search size='1.5rem' />}
                hideTitle
              />
            )}

            <Link passHref href='/products'>
              <NavButton
                title={t('pages.product_plural')}
                icon={<ShoppingBag size='1.5rem' />}
                hideTitle={ownTheme.menu.variant === 'minimal'}
              />
            </Link>

            <Link passHref href='/about'>
              <NavButton
                title={t('pages.aboutUs')}
                icon={<Briefcase size='1.5rem' />}
                hideTitle={ownTheme.menu.variant === 'minimal'}
              />
            </Link>

            <Link passHref href='/cart'>
              <NavButton
                title={t('pages.cart')}
                hideTitle
                icon={
                  <Positioner
                    overlayContent={
                      <Badge
                        variant='solid'
                        colorScheme='primary'
                        borderRadius='full'
                        size='sm'
                        py={'1px'}
                      >
                        {cartCount ?? 0}
                      </Badge>
                    }
                  >
                    <ShoppingCart size='1.5rem' />
                  </Positioner>
                }
              />
            </Link>

            <AccountMenu
              user={user}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
          </Flex>

          {ownTheme.logo.position === 'right' && logo}
        </Flex>

        {ownTheme.menu.variant === 'full' && (
          <Box display={['block', 'none', 'none']} my={1}>
            {presetSearch}
          </Box>
        )}
      </Box>
    </Flex>
  );
};
