export const NoAddress = ({
  primary,
  background,
}: {
  primary: string;
  background: string;
}) => (
  <svg width="136" height="136" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
      <path
        d="M83.938 99.875H52.061L25.5 133.344h85L83.937 99.875z"
        fill="#EAFAFF"
      />
      <path
        d="M106.781 99.875H83.937l26.563 33.469h22.844l-26.563-33.469zM29.219 99.875L2.656 133.344H25.5l26.563-33.469H29.218z"
        fill={primary}
      />
      <path
        d="M83.938 69.063a2.657 2.657 0 000 5.312 2.657 2.657 0 000-5.313z"
        fill={background}
      />
      <path
        d="M27.138 98.224L.576 131.693A2.655 2.655 0 002.656 136h130.688a2.655 2.655 0 002.08-4.307l-26.563-33.469a2.655 2.655 0 00-2.08-1.005H83.513l19.865-31.157c4.66-6.986 7.122-15.134 7.122-23.562C110.5 19.066 91.435 0 68 0S25.5 19.066 25.5 42.5a42.32 42.32 0 007.122 23.562l19.865 31.157H29.219c-.81 0-1.577.37-2.08 1.005zm-9.917 21.042h16.06l-9.064 11.422H8.155l9.066-11.422zm38.654-16.735l7.281 11.422H44.28l9.066-11.422h2.529zm24.251 0h2.529l9.064 11.422H72.844l7.282-11.422zm15.81 16.735l9.065 11.422H30.999l9.066-11.422h55.871zm15.847 11.422l-9.065-11.422h16.062l9.064 11.422h-16.061zm2.78-16.735h-16.06l-9.066-11.422h16.062l9.064 11.422zM37.057 63.136A37.025 37.025 0 0130.812 42.5C30.812 21.995 47.495 5.312 68 5.312c20.505 0 37.187 16.683 37.187 37.188 0 7.385-2.159 14.52-6.243 20.636l-.031.046L68 111.668a1839791.344 1839791.344 0 00-30.943-48.532zm9.506 39.395L37.5 113.953H21.437l9.065-11.422h16.061z"
        fill={background}
      />
      <path
        d="M68 69.063c14.582 0 26.563-11.81 26.563-26.563 0-14.647-11.916-26.563-26.563-26.563-14.647 0-26.563 11.916-26.563 26.563 0 14.758 11.985 26.563 26.563 26.563zm0-47.813c11.718 0 21.25 9.532 21.25 21.25 0 11.827-9.61 21.25-21.25 21.25-11.644 0-21.25-9.423-21.25-21.25 0-11.718 9.532-21.25 21.25-21.25zM79.187 78.127a2.656 2.656 0 00-3.646.904l-9.817 16.288a2.656 2.656 0 104.55 2.742l9.817-16.288a2.656 2.656 0 00-.904-3.646z"
        fill={background}
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0h136v136H0z" />
      </clipPath>
    </defs>
  </svg>
);
