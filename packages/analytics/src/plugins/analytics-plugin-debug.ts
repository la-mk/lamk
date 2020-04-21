export default function debug() {
  return {
    /* Name is a required field for plugins */
    name: 'debug',
    /* Bootstrap runs when analytics starts */
    bootstrap: (props: any) => {
      console.debug('Bootstraping analytics', props);
    },
    params: (props: any) => {
      console.debug('Parsing params', props);
    },
    campaign: (props: any) => {
      console.debug('Campaign called due to utm parameter', props);
    },
    initialize: (props: any) => {
      console.debug('Initializing', props);
    },
    ready: (props: any) => {
      console.debug('Ready', props);
    },
    reset: (props: any) => {
      console.debug('Reset', props);
    },
    page: (props: any) => {
      console.debug('Page change', props);
    },
    track: (props: any) => {
      console.debug('Track event', props);
    },
    identify: (props: any) => {
      console.debug('Identify user', props);
    },
  };
}
