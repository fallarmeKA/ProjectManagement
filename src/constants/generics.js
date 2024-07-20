export const getDefaultChartStatuses = () => ({
  incomplete: {
    value: 0,
    label: "Incomplete",
    color: STATUS_COLORS.incomplete,
  },
  "in progress": {
    value: 0,
    label: "In Progress",
    color: STATUS_COLORS["in progress"],
  },
  complete: {
    value: 0,
    label: "Complete",
    color: STATUS_COLORS.complete,
  },
});

export const STATUS_COLORS = {
  incomplete: "#e74c3c",
  "in progress": "#f1c40f",
  complete: "#07bc0c",
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
