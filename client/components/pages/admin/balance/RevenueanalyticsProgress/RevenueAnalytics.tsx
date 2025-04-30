import React, { Component } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamic import for ApexCharts to disable server-side rendering
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Report and DataPoint interfaces
interface Report {
  _id: string;
  date: string;
  totalIncome: number;
  totalExpenses: number;
}

interface DataPoint {
  x: string;
  y: number;
}

// Series interface for ApexCharts
interface Series {
  name: string;
  type: "line" | "area";
  data: DataPoint[];
}

// State interface including options and series
interface State {
  options: ApexOptions;
  series: Series[];
}

// RevenueAnalytics props interface
interface RevenueAnalyticsProps {
  reports: Report[];
}

// RevenueAnalytics class component
class RevenueAnalytics extends Component<RevenueAnalyticsProps, State> {
  constructor(props: RevenueAnalyticsProps) {
    super(props);
    const initialState =
      this.props.reports && this.props.reports.length > 0
        ? this.prepareData(
            this.props.reports,
            this.determineReportType(this.props.reports)
          )
        : [];

    this.state = {
      series: initialState,
      options: {
        chart: {
          height: 350,
          animations: { speed: 500 },
          dropShadow: {
            enabled: true,
            top: 8,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        colors: [
          "rgb(132, 90, 223)",
          "rgba(35, 183, 229, 0.85)",
          "rgba(119, 119, 142, 0.05)",
        ],
        dataLabels: { enabled: false },
        grid: { borderColor: "#f1f1f1", strokeDashArray: 3 },
        stroke: { curve: "smooth", width: [2, 2, 0], dashArray: [0, 5, 0] },
        xaxis: { axisTicks: { show: false } },
        yaxis: { labels: { formatter: (value) => `$${value.toFixed(0)}` } },
        tooltip: {
          y: [
            { formatter: (e) => `$${e.toFixed(0)}` },
            { formatter: (e) => `$${e.toFixed(0)}` },
            { formatter: (e) => `${e.toFixed(0)}` },
          ],
        },
        legend: {
          show: true,
          customLegendItems: ["Profit", "Revenue", "Sales"],
          inverseOrder: true,
        },
        title: {
          text: "Revenue Analytics with sales & profit (USD)",
          align: "left",
          style: {
            fontSize: ".8125rem",
            fontWeight: "semibold",
            color: "#8c9097",
          },
        },
        markers: { hover: { sizeOffset: 5 } },
      },
    };
  }
  determineReportType(reports: Report[]): "monthly" | "yearly" {
    // Parse dates and sort them
    const dates = reports
      .map((report) => new Date(report.date))
      .sort((a, b) => a.getTime() - b.getTime());
    console.log("dates", dates);
    // Get the first and last date from the sorted array
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    // Calculate the difference in months
    const monthDiff =
      (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
      lastDate.getMonth() -
      firstDate.getMonth();

    // Determine if the range is more than two months
    if (monthDiff > 1) {
      return "yearly"; // Span is more than two months
    } else {
      return "monthly"; // Span is two months or less
    }
  }
  // Data preparation method
  prepareData(reports: Report[], type: "monthly" | "yearly"): Series[] {
    const getKey = (date: string) => {
      const [year, month, day] = date.split("-");
      if (type === "yearly") {
        // Yearly type: Use month and year as key
        return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
          "default",
          { month: "short" }
        )} ${year}`;
      } else {
        // Monthly type: Use day, month, and year as key
        return `${new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        ).toLocaleString("default", {
          day: "2-digit",
          month: "short",
        })}, ${year}`;
      }
    };

    // Group reports by generated key
    const grouped = reports.reduce(
      (acc, { date, totalIncome, totalExpenses }) => {
        const key = getKey(date);
        acc[key] = acc[key] || { totalIncome: 0, totalExpenses: 0 };
        acc[key].totalIncome += totalIncome;
        acc[key].totalExpenses += totalExpenses;
        return acc;
      },
      {} as Record<string, { totalIncome: number; totalExpenses: number }>
    );

    // Convert grouped data to series format
    const incomeData: DataPoint[] = [];
    const expenseData: DataPoint[] = [];
    const profitData: DataPoint[] = [];

    Object.entries(grouped).forEach(([key, { totalIncome, totalExpenses }]) => {
      incomeData.push({ x: key, y: totalIncome });
      expenseData.push({ x: key, y: totalExpenses });
      profitData.push({ x: key, y: totalIncome - totalExpenses });
    });

    return [
      { name: "Profit", type: "line", data: profitData },
      { name: "Revenue", type: "line", data: incomeData },
      { name: "Expenses", type: "area", data: expenseData },
    ];
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
}

export default RevenueAnalytics;
