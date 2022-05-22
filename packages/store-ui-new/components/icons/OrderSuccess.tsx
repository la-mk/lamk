export const OrderSuccess = ({
  primary,
  background,
  muted,
}: {
  primary: string;
  background: string;
  muted: string;
}) => (
  <svg width="133" height="133" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
      <path
        d="M76.724 109.083H29.91c-5.908-.007-10.723-4.74-10.832-10.648l11.117-62.769h-4.185a4.289 4.289 0 00-4.259 3.642l-.007.043-12.145 68.561c.108 5.908 4.924 10.641 10.832 10.648h63.533l-2.585-2.753a26.569 26.569 0 01-4.654-6.724z"
        fill={muted}
      />
      <path
        d="M121.205 89.037a26.06 26.06 0 00-15.383-8.078l-7.463-42.127a8.691 8.691 0 00-8.624-7.358H25.884a8.692 8.692 0 00-8.625 7.358L5.08 107.573a2.132 2.132 0 00-.034.386c.01 8.422 6.835 15.246 15.257 15.256H81.65a26.157 26.157 0 0045.206-8.081 26.156 26.156 0 00-5.651-26.097h.001zM9.471 108.144l12.145-68.562.008-.042a4.29 4.29 0 014.259-3.643h63.85a4.29 4.29 0 014.259 3.643l.007.042 7.284 41.118a26.163 26.163 0 00-22.518 38.092h-58.46c-5.908-.006-10.725-4.74-10.834-10.648zm92.57 20.426a21.83 21.83 0 01-17.522-8.876 21.735 21.735 0 0119.24-34.522c11.631.923 20.458 10.867 19.996 22.525-.461 11.659-10.047 20.873-21.716 20.874l.002-.001z"
        fill={primary}
      />
      <path
        d="M57.808 0C44.688.015 34.054 10.648 34.04 23.77v24.144a2.212 2.212 0 004.423 0V23.769c0-10.685 8.662-19.346 19.346-19.346 10.685 0 19.347 8.661 19.347 19.346v24.145a2.211 2.211 0 104.423 0V23.769C81.563 10.65 70.93.015 57.808 0zM113.261 98.367l-14.347 13.704-7.497-7.497a2.212 2.212 0 10-3.129 3.128l9.026 9.026c.85.849 2.222.865 3.091.034l15.912-15.197a2.21 2.21 0 00-.899-3.737 2.212 2.212 0 00-2.157.54z"
        fill={background}
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0h133v133H0z" />
      </clipPath>
    </defs>
  </svg>
);
