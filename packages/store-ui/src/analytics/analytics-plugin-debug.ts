export default function debug() {
  return {
    /* Name is a required field for plugins */
    name: 'debug',
    /* Bootstrap runs when analytics starts */
    bootstrap: props => {
      console.debug('Bootstraping analytics', props);
    },
    params: props => {
      console.debug('Parsing params', props);
    },
    campaign: props => {
      console.debug('Campaign called due to utm parameter', props);
    },
    initialize: props => {
      console.debug('Initializing', props);
    },
    ready: props => {
      console.debug('Ready', props);
    },
    reset: props => {
      console.debug('Reset', props);
    },
    page: props => {
      console.debug('Page change', props);
    },
    track: props => {
      console.debug('Track event', props);
    },
    identify: props => {
      console.debug('Identify user', props);
    },
  };
}
