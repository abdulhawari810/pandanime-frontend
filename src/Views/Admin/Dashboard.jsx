import { NavLink } from "react-router-dom";
import Chart from "react-apexcharts";
import React from "react";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
          toolbar: { show: false },
          //foreColor: "#000000",
          background: "transparent",
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        grid: {
          borderColor: "rgba(255,255,255,0.1)",
          row: { colors: ["transparent", "transparent"] },
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
          labels: { style: { colors: "#94A3B8" } },
        },
        yaxis: {
          labels: { style: { colors: "#94A3B8" } },
        },
        tooltip: {
          theme: "dark", // atau "light"
          style: {
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
          },
          y: {
            formatter: (val) => `Rp ${val} JT`, // ubah teks nilai Y
            title: {
              formatter: (seriesName) => `${seriesName}:`, // ubah label series
            },
          },
          x: {
            formatter: (val) => `Tahun ${val}`, // ubah label X
          },
        },
        colors: ["#7C3AED", "#06B6D4"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "vertical",
            gradientToColors: ["#06B6D4"],
            stops: [0, 100],
          },
        },
      },
      series: [
        {
          name: "Revenue",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    };
  }

  render() {
    return (
      <div className="container px-6 py-6 w-full min-h-screen bg-[#0f1117] text-white">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <NavLink className="text-slate-400 hover:text-indigo-400 transition-all">
            <i className="ri-home-9-line text-[22px]"></i>
          </NavLink>
          <i className="ri-arrow-right-s-line text-[20px] text-slate-500"></i>
          <span className="text-slate-300 text-[18px]">Dashboard</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-400">
            Selamat datang kembali, Admin! Berikut perkembangan bisnis hari ini.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Total Revenue",
              value: "Rp 10JT",
              icon: "ri-money-dollar-circle-line",
              color: "from-indigo-500 to-blue-500",
              growth: "20.9%",
            },
            {
              title: "Total Anime",
              value: "10Rb Anime",
              icon: "ri-tv-line",
              color: "from-pink-500 to-rose-500",
              growth: "12.4%",
            },
            {
              title: "Total Premium",
              value: "10Rb Premium",
              icon: "ri-vip-crown-line",
              color: "from-yellow-400 to-orange-500",
              growth: "18.7%",
            },
            {
              title: "Total Users",
              value: "50Rb Users",
              icon: "ri-user-line",
              color: "from-green-500 to-emerald-500",
              growth: "50.9%",
            },
            {
              title: "Laporan Bug",
              value: "1.2K Laporan",
              icon: "ri-bug-line",
              color: "from-red-500 to-pink-500",
              growth: "9.8%",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-5 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg hover:scale-[1.03] transition-transform`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm uppercase text-white/70 font-medium">
                    {item.title}
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {item.value}
                  </h2>
                  <div className="mt-2">
                    <span className="bg-white/20 text-white px-2 py-1 rounded-lg text-sm">
                      <i className="ri-funds-line"></i> {item.growth}
                    </span>
                    <span className="text-white/80 text-sm ml-2">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="text-4xl text-white/90">
                  <i className={item.icon}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-[#1a1b23] rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-5 text-white">
            Revenue Overview
          </h2>
          <div className="w-full flex justify-center">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="area"
              className="w-full lg:w-[80%]"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
