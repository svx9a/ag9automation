import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const AutomaticThaiLogo = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export const XMarkIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const LineIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.3,3.5c-0.5-0.5-1.2-0.8-2-0.8H4.7c-0.8,0-1.5,0.3-2,0.8C2.1,4,1.9,4.7,1.9,5.5v10c0,0.8,0.3,1.5,0.8,2 c0.5,0.5,1.2,0.8,2,0.8h1.8v3.2c0,0.4,0.3,0.6,0.6,0.6c0.1,0,0.2,0,0.3-0.1l3.9-3.7h8.1c0.8,0,1.5-0.3,2-0.8 c0.5-0.5,0.8-1.2,0.8-2v-10C22.1,4.7,21.9,4,21.3,3.5z M8.5,13.2h-2V7.7h2V13.2z M12.8,13.2h-2V7.7h2V13.2z M17.2,13.2h-2V7.7h2 V13.2z"/>
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.031A9.953 9.953 0 0022 12z"/>
  </svg>
);

export const SpinnerIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props} className={`animate-spin ${props.className}`}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{opacity: 0.25}}></circle>
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const UserCircleIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const ArrowRightOnRectangleIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);

export const MapPinIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChatIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0L13.5 18.502a1.125 1.125 0 01-1.59 0l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72A1.125 1.125 0 012.25 18.502v-5.498a2.25 2.25 0 012.25-2.25h.519a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 012.25-2.25h3.832c.97 0 1.813.713 2.097 1.632z" />
  </svg>
);

export const BoltIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const DocumentTextIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const MegaphoneIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

export const SparklesIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.188-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.188a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.188.398a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

export const TagIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.171 0-3.535.012-4.78.069-2.695.123-3.958 1.4-4.08 4.08-.057 1.245-.068 1.614-.068 4.78s.011 3.535.068 4.78c.123 2.68 1.385 3.958 4.08 4.08 1.245.057 1.61.068 4.78.068s3.535-.011 4.78-.068c2.695-.123 3.958-1.385 4.08-4.08.057-1.245.068-1.61.068-4.78s-.011-3.535-.068-4.78c-.123-2.68-1.385-3.958-4.08-4.08-1.245-.057-1.61-.068-4.78-.068zm0 2.882c-2.454 0-4.438 1.984-4.438 4.438s1.984 4.438 4.438 4.438 4.438-1.984 4.438-4.438-1.984-4.438-4.438-4.438zm0 7.318c-1.595 0-2.882-1.287-2.882-2.882s1.287-2.882 2.882-2.882 2.882 1.287 2.882 2.882-1.287 2.882-2.882 2.882zm4.965-7.39c-.777 0-1.408.631-1.408 1.408s.631 1.408 1.408 1.408 1.408-.631 1.408-1.408-.631-1.408-1.408-1.408z"/>
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const ShopifyIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.5,7.5H16.5V6a4.5,4.5,0,0,0-9,0V7.5H4.5a1.5,1.5,0,0,0-1.5,1.5v12A1.5,1.5,0,0,0,4.5,22.5h15A1.5,1.5,0,0,0,21,21V9A1.5,1.5,0,0,0,19.5,7.5Zm-9-1.5a1.5,1.5,0,0,1,3,0V7.5H10.5Z"/>
  </svg>
);

export const ShopeeIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.5,8.7V17a1,1,0,0,1-1,1H3.5a1,1,0,0,1-1-1V8.7L5.8,5.1h12.4ZM12,9.3a4,4,0,0,0-4,4,1,1,0,0,0,2,0,2,2,0,0,1,4,0,1,1,0,0,0,2,0,4,4,0,0,0-4-4Zm6.2-6.1H5.8A3.3,3.3,0,0,0,2.5,6.5V17a3.3,3.3,0,0,0,3.3,3.3h12.4a3.3,3.3,0,0,0,3.3-3.3V6.5A3.3,3.3,0,0,0,18.2,3.2Z" />
  </svg>
);

export const LazadaIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.3,6.3c-0.3-1.1-0.9-2-1.8-2.7c-1-0.7-2.1-1.1-3.4-1.1c-1.8,0-3.4,0.6-4.6,1.9c-0.6,0.6-1,1.3-1.3,2.1 c-0.2-0.6-0.5-1.1-0.8-1.6C8.6,3.6,7.5,2.9,6.2,2.5C5.1,2.1,4,2,2.9,2C2.7,2,2.6,2,2.4,2c-0.1,0-0.2,0-0.2,0.1 C2,2.1,2,2.2,2,2.3c0,0.3,0,0.7,0.1,1c0.3,1.1,0.9,2.1,1.7,2.8c1,0.9,2.2,1.3,3.5,1.3c1.7,0,3.1-0.6,4.3-1.8 c0.5-0.5,0.8-1,1.1-1.6c0.2,0.8,0.6,1.5,1.1,2c1.2,1.3,2.8,2,4.6,2c1.3,0,2.5-0.4,3.5-1.3c0.8-0.7,1.4-1.7,1.7-2.8 c0.1-0.3,0.1-0.6,0.1-1c0-0.1,0-0.2-0.1-0.2c-0.1,0-0.1,0-0.2,0C22.1,5.6,21.7,5.8,21.3,6.3z M17.6,19.3L12,14.4l-5.6,4.9 c-0.2,0.2-0.5,0.3-0.8,0.3c-0.7,0-1.2-0.5-1.2-1.2v-8c0-0.1,0-0.2,0.1-0.2c0,0,0.1,0,0.1,0c1,0.2,2,0.2,2.9-0.2 c-0.1,0.3-0.1,0.6-0.1,0.9c0,1.3,0.4,2.5,1.3,3.5c1.2,1.3,2.8,2,4.6,2s3.4-0.7,4.6-2c0.9-1,1.3-2.2,1.3-3.5c0-0.3,0-0.6-0.1-0.9 c0.9,0.3,1.9,0.4,2.9,0.2c0,0,0.1,0,0.1,0c0.1,0,0.1,0.1,0.1,0.2v8c0,0.7-0.5,1.2-1.2,1.2C18.1,19.6,17.8,19.5,17.6,19.3z" />
  </svg>
);

export const TikTokIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 0 .17.02.25.04.5.12.98.34 1.43.65.27.19.53.4.78.64.3.3.58.63.82.99.23.34.43.71.59 1.1.13.31.23.63.31.96.05.22.08.45.1.68.02.22.03.44.03.66s-.01.44-.03.66a5.78 5.78 0 0 1-.31.96c-.16.39-.36.76-.59 1.1a4.34 4.34 0 0 1-.82.99c-.25.24-.51.45-.78.64a4.34 4.34 0 0 1-1.43.65c-.17.06-.34.1-.52.13a11.1 11.1 0 0 1-3.91.02c-1.31.02-2.61.01-3.91.02a11.1 11.1 0 0 1-3.91-.02c-.18-.03-.35-.07-.52-.13a4.34 4.34 0 0 1-1.43-.65 4.34 4.34 0 0 1-.78-.64 4.34 4.34 0 0 1-.82-.99c-.23-.39-.43-.76-.59-1.1a5.78 5.78 0 0 1-.31-.96c-.05-.22-.08-.45-.1-.68a11.1 11.1 0 0 1-.03-.66c0-.22.01-.44.03-.66a5.78 5.78 0 0 1 .31-.96c.16-.39.36-.76.59-1.1.24-.36.52-.69.82-.99.25-.24.51-.45.78-.64.45-.31.93-.53 1.43-.65.08-.02.17-.04.25-.04 1.3-.01 2.6-.02 3.91-.02zM16.38 5.08c-.29-.22-.6-.4-.93-.54a4.6 4.6 0 0 0-1.1-.31c-.13-.03-.27-.05-.4-.06-1.04-.01-2.08-.02-3.12-.02-1.04 0-2.08.01-3.12.02-.13.01-.27.03-.4.06-.37.07-.73.17-1.1.31-.33.14-.64.32-.93.54a2.5 2.5 0 0 0-.64.55c-.18.25-.33.52-.46.8-.13.28-.23.57-.3.87-.05.2-.08.4-.1.6-.02.2-.03.4-.03.6s.01.4.03.6c.02.2.05.4.1.6.07.3.17.59.3.87.13.28.28.55.46.8.19.26.4.49.64.7.29.22.6.4.93.54.37.14.74.24 1.1.31.13.03.27.05.4.06 1.04.01 2.08.02 3.12.02 1.04 0 2.08-.01 3.12-.02.13-.01.27-.03.4-.06.37-.07.73-.17-1.1-.31.33-.14.64-.32.93-.54.24-.18.45-.39.64-.61.19-.22.36-.46.5-.71.13-.25.24-.51.32-.78.08-.27.14-.55.17-.83.03-.28.04-.56.04-.84s-.01-.56-.04-.84a4.9 4.9 0 0 0-.17-.83c-.08-.27-.19-.53-.32-.78a2.8 2.8 0 0 0-.5-.71 2.5 2.5 0 0 0-.64-.61zM10.23 14.28V5.55h2.95v6.55c0 1.25.99 2.24 2.24 2.24.18 0 .36-.02.53-.06.18-.04.34-.1.5-.18v2.85c-.21.08-.43.14-.65.18-.22.04-.45.06-.68.07-.33.02-.66.02-1 .02-1.63 0-3.1-.64-4.22-1.76a5.8 5.8 0 0 1-1.7-4.18z"/>
  </svg>
);

export const VercelIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2 22h20L12 2z"/>
  </svg>
);

export const AzureIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14.16 13.56L8.04 22.28L0 22.28L6.81 11.23L4.47 7.29L8.04 7.29L10.74 12.06L14.16 6L24 6L14.16 13.56Z"/>
  </svg>
);

export const GoogleCloudIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.33 13.11c-1.2.5-1.95 1.62-1.95 2.94 0 1.79 1.46 3.25 3.25 3.25.96 0 1.83-.43 2.42-1.12l-2.09-1.25c-.27.26-.64.42-1.04.42-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25h2.89c-.19-1.02-.7-1.91-1.48-2.58zm12.33-1.04c0-1.4-1.14-2.53-2.53-2.53s-2.53 1.14-2.53 2.53 1.14 2.53 2.53 2.53 2.53-1.13 2.53-2.53zm-2.53-1.22c.68 0 1.22.55 1.22 1.22s-.55 1.22-1.22 1.22-1.22-.55-1.22-1.22.54-1.22 1.22-1.22zM12.01 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm.11 18c-2.3 0-4.37-1.03-5.83-2.65l1.52-1.2c1.01 1.1 2.4 1.82 4.02 1.82 2.93 0 5.09-2.07 5.09-5.02 0-2.88-2.02-4.95-4.9-4.95-1.84 0-3.32.91-4.22 2.21l1.49.88c.5-.83 1.34-1.35 2.42-1.35 1.72 0 2.92 1.22 2.92 2.96 0 1.79-1.27 2.99-2.99 2.99-.76 0-1.42-.29-1.94-.76l-1.54 1.22c.96 1.3 2.65 2.21 4.5 2.21 3.31 0 5.92-2.61 5.92-5.96s-2.61-5.96-5.92-5.96-5.92 2.61-5.92 5.96c0 1.63.66 3.1 1.7 4.19l-1.48 1.23C5.1 16.09 4.11 14.16 4.11 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

export const AwsIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.43 17.82c.26-.22.45-.51.56-.84.11-.34.17-.7.17-1.08 0-1.21-.36-2.18-1.08-2.92-.72-.74-1.66-1.11-2.82-1.11-.99 0-1.8.26-2.44.79-.64.52-.96 1.25-.96 2.19 0 .61.16 1.15.47 1.63.31.48.72.82 1.23 1.01l.24.08.38-.26c.25-.17.48-.39.69-.64.21-.26.31-.56.31-.91 0-.4-.13-.73-.39-1s-.62-.39-1.08-.39c-.43 0-.78.14-1.05.43s-.4.67-.4.11c0 .24.05.46.15.65.1.19.25.35.45.46.2.12.44.18.72.18.43 0 .8-.13 1.1-.38.3-.25.5-.59.58-1.02h2.02c-.18.82-.55 1.5-1.11 2.03-.56.53-1.26.8-2.1.8-1.02 0-1.88-.34-2.57-1.01C4.34 15.63 4 14.7 4 13.6c0-1.15.39-2.12 1.16-2.92s1.73-1.19 2.88-1.19c1.2 0 2.18.33 2.94 1 .76.66 1.14 1.55 1.14 2.68 0 .5-.09 1-.27 1.48-.18.48-.46.9-.82 1.25zm5.12.28c.39-.42.58-.96.58-1.61 0-.6-.19-1.12-.56-1.55-.37-.43-.86-.65-1.46-.65-.63 0-1.15.22-1.56.65-.41.43-.61.95-.61 1.55 0 .65.2 1.19.61 1.61.41.42.93.63 1.56.63.6 0 1.09-.21 1.48-.63zM14.1 6.8c.45.45.68 1.03.68 1.76 0 .73-.23 1.32-.68 1.76-.45.44-1.02.66-1.71.66s-1.26-.22-1.71-.66c-.45-.44-.68-1.03-.68-1.76 0-.73.23-1.32.68-1.76.45-.44 1.02-.66 1.71.66s1.26.22 1.71.66z"/>
  </svg>
);

export const OpenAiIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.387 4.234a.45.45 0 00-.812-.03L12 9.435l-3.575-5.23a.45.45 0 00-.812.029L2.83 14.176a.45.45 0 00.378.674h4.417l2.122-3.11a.45.45 0 01.766 0l2.122 3.11h4.417a.45.45 0 00.378-.674zM1.11 15.299A.45.45 0 011.5 15h1.989a.45.45 0 00.354-.74L2.24 12.02a.45.45 0 00-.782.441l-.43 2.44a.45.45 0 00.082.398zm21.78 0a.45.45 0 00.082-.398l-.43-2.44a.45.45 0 00-.783-.442l-1.6 2.24a.45.45 0 00.354.74H22.5a.45.45 0 01.39-.299zM12 21.9a.45.45 0 00.384-.206l3.742-5.485a.45.45 0 00-.384-.69h-7.484a.45.45 0 00-.384.69l3.742 5.485A.45.45 0 0012 21.9z"/>
  </svg>
);

export const ArrowUpIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

export const CurrencyDollarIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.768 0-1.536.219-2.121.659-1.171.879-1.171 2.303 0 3.182s2.303 1.171 3.182 0l.879-.659" />
  </svg>
);

export const PlusIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const ShoppingCartIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.836A1.125 1.125 0 0018.016 5.25H4.287M7.5 14.25L5.106 5.165m0 0A1.5 1.5 0 016.471 4h11.058a1.5 1.5 0 011.366.865l1.823 6.836a.375.375 0 01-.22.469l-11.218 3.525M7.5 14.25" />
  </svg>
);

export const StarIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const GiftIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 21c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343-3-3-3zM3 9h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5M3.75 15h16.5M4.5 9v6m15-6v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 21v-6.75a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75V21M12 3v6" />
    </svg>
);

export const ArrowDownIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
);

export const TwitterIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);