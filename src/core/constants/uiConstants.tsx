export const selectThemeConst = (theme: any) => {
  return {
    ...theme,
    borderRadius: 0,
    colors: {
      ...theme.colors,
      primary25: '#F2F3F5',
      primary: '#2560AA',
    },
  };
};

export const assets = {
  baggageReportBackground: '/images/baggage_report_background_cover.jpg',
};
