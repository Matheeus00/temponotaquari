import type { WeatherIndexId } from '../../types';

export const IndexIcon = ({ id }: { id: WeatherIndexId }) => {
  if (id === 'barbecue') {
    return <path d="M5 13h14l-1.5 7h-11L5 13Zm-1-3h16M8 6c-1-1 1-2 0-3m4 3c-1-1 1-2 0-3m4 3c-1-1 1-2 0-3" />;
  }
  if (id === 'mosquito') {
    return (
      <>
        <path d="M10 4h4v4h-4zM12 8v13M12 3V1" />
        <path d="m11 11-4-3m6 3 4-3m-5 7-4 4m6-4 4 4" />
        <path d="m12 12-7-3m7 3 7-3" />
      </>
    );
  }
  if (id === 'frizz') {
    return <path d="M7 20c-2-2-2-4 0-6s2-4 0-6m5 12c-2-2-2-4 0-6s2-4 0-6m5 12c-2-2-2-4 0-6s2-4 0-6M5 4h14" />;
  }
  if (id === 'skin-dryness') {
    return <path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Zm-2 12 4 4m0-4-4 4" />;
  }
  if (id === 'cold') {
    return <path d="M12 3v18m-7-14 14 8M5 15l14-8m-9-1 2 2 2-2m-4 14 2-2 2 2M4 9l3-.2-.7-2.8m13 9-3 .2.7 2.8m0-12L16 8l3 .2M5 16l3-.2-.7-2.8" />;
  }
  return <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />;
};
