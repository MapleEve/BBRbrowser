import { Tag } from "antd";
import { serverListKeys } from "./api";
import { startCase } from "lodash";

export const tableColumns = [
  {
    title: "名称",
    dataIndex: serverListKeys.name,
    key: serverListKeys.name,
    sorter: (a, b) => a.Name.localeCompare(b.Name),
  },
  {
    title: "区服",
    dataIndex: serverListKeys.region,
    key: serverListKeys.region,
    align:"center",
    sorter: (a, b) => a.Region.localeCompare(b.Region),
    render: (_, record) => {
      const { Region } = record;
      return <Tag>{Region}</Tag>;
    },
  },
  {
    title: "模式",
    dataIndex: serverListKeys.gamemode,
    key: serverListKeys.gamemode,
    align:"center",
    sorter: (a, b) => a.Gamemode.localeCompare(b.Gamemode),
  },
  {
    title: "玩家数",
    dataIndex: serverListKeys.playersStatus,
    key: serverListKeys.playersStatus,
    align:"center",
    sorter: (a, b) => a.Players - b.Players,
    render: (_, record) => {
      const { statusColor, PlayersStatus } = record;
      return <Tag color={statusColor}>{PlayersStatus}</Tag>;
    },
  },
  {
    title: "地图",
    dataIndex: serverListKeys.map,
    key: serverListKeys.map,
    align:"center",
    sorter: (a, b) => a.Map.localeCompare(b.Map),
  },
  {
    title: "容量",
    dataIndex: serverListKeys.mapSize,
    key: serverListKeys.mapSize,
    align:"center",
    sorter: (a, b) => a.MapSize.localeCompare(b.MapSize),
    render: (_, record) => {
      const { MapSize } = record;
      let color = "";
      switch (MapSize.toLowerCase()) {
        case "small":
          color = "green";
          break;
        case "medium":
          color = "blue";
          break;
        case "big":
          color = "orange";
          break;
        case "ultra":
          color = "magenta";
          break;
        default:
          color = "";
      }
      return <Tag color={color}>{MapSize}</Tag>;
    },
  },
  {
    title: "日/夜",
    dataIndex: serverListKeys.dayNight,
    key: serverListKeys.dayNight,
    align:"center",
    sorter: (a, b) => a.DayNight.localeCompare(b.DayNight),
    render: (_, record) => {
      const { DayNight } = record;
      const dayFlag = DayNight.toLowerCase().includes("白天");
      return <Tag color={dayFlag ? "orange" : "blue"}>{DayNight}</Tag>;
    },
  },
  {
    title: "刷新率",
    dataIndex: serverListKeys.hz,
    key: serverListKeys.hz,
    align:"center",
    sorter: (a, b) => a.Hz - b.Hz,
    render: (_, record) => {
      const { Hz } = record;
      const HzNum = Number(Hz);
      let color = ""; // default for 60
      if (HzNum < 60) color = "magenta";
      if (HzNum >= 60 && HzNum < 120) color = "";
      if (HzNum >= 120 && HzNum < 144) color = "blue";
      if (HzNum >= 144 && HzNum <= 200) color = "orange";
      if (HzNum > 200) color = "green";
      return <Tag color={color}>{HzNum}</Tag>;
    },
  },
  {
    title: "官服",
    dataIndex: serverListKeys.isOfficial,
    key: serverListKeys.isOfficial,
    align:"center",
    sorter: (a, b) => a.IsOfficial.localeCompare(b.IsOfficial),
    render: (_, record) => {
      const { IsOfficial } = record;
      const officialFlag = IsOfficial.toLowerCase().includes("官方服");
      return <Tag color={officialFlag ? "green" : "blue"}>{IsOfficial}</Tag>;
    },
  },
  {
    title: "密码",
    dataIndex: serverListKeys.hasPassword,
    key: serverListKeys.hasPassword,
    align:"center",
    sorter: (a, b) => a.HasPassword.localeCompare(b.HasPassword),
    render: (_, record) => {
      const { HasPassword } = record;
      const hasPassFlag = HasPassword.toLowerCase().includes("密码");
      return <Tag color={hasPassFlag ? "red" : "green"}>{HasPassword}</Tag>;
    },
  },
  {
    title: "反作弊",
    dataIndex: serverListKeys.antiCheat,
    key: serverListKeys.antiCheat,
    align:"center",
    sorter: (a, b) => a.AntiCheat.localeCompare(b.AntiCheat),
  },
  {
    title: "版本号",
    dataIndex: serverListKeys.build,
    key: serverListKeys.build,
    align:"center",
    sorter: (a, b) => a.Build.localeCompare(b.Build),
  },
];
