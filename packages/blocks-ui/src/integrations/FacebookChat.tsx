import * as React from 'react';
import { useEffect } from 'react';

export const FacebookChat = ({ pageId }: { pageId: string | undefined }) => {
  useEffect(() => {
    if (!pageId) {
      return;
    }

    document.getElementById('fb-root')?.remove();
    document.getElementsByClassName('fb-customerchat')[0]?.remove();
    document.getElementById('fb-chat-script')?.remove();

    const r = document.createElement('div');
    r.id = 'fb-root';

    const c = document.createElement('div');
    c.className = 'fb-customerchat';
    c.setAttribute('attribution', 'biz_inbox');
    c.setAttribute('data-page_id', pageId);

    const s = document.createElement('script');
    s.id = 'fb-chat-script';
    s.type = 'text/javascript';
    s.innerHTML = `
    window.fbAsyncInit = function() {
      FB.init({
        xfbml            : true,
        version          : 'v10.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    `;

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(r);
    body.appendChild(s);
    body.appendChild(c);
  }, [pageId]);

  return <></>;
};
