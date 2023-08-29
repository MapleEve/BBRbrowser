import { Tag } from "antd";
import { serverListKeys } from "./api";
import { startCase } from "lodash";

export const tableColumns = [
  {
    title: startCase(serverListKeys.name),
    dataIndex: serverListKeys.name,
    key: serverListKeys.name,
    sorter: (a, b) => a.Name.localeCompare(b.Name),
  },
  {
    title: startCase(serverListKeys.region),
    dataIndex: serverListKeys.region,
    key: serverListKeys.region,
    sorter: (a, b) => a.Region.localeCompare(b.Region),
    render: (_, record) => {
      const { Region } = record;
      return <Tag>{Region}</Tag>;
    },
  },
  {
    title: startCase(serverListKeys.gamemode),
    dataIndex: serverListKeys.gamemode,
    key: serverListKeys.gamemode,
    sorter: (a, b) => a.Gamemode.localeCompare(b.Gamemode),
  },
  {
    title: startCase(serverListKeys.playersStatus),
    dataIndex: serverListKeys.playersStatus,
    key: serverListKeys.playersStatus,
    sorter: (a, b) => a.Players - b.Players,
    render: (_, record) => {
      const { statusColor, PlayersStatus } = record;
      return <Tag color={statusColor}>{PlayersStatus}</Tag>;
    },
  },
  {
    title: startCase(serverListKeys.map),
    dataIndex: serverListKeys.map,
    key: serverListKeys.map,
    sorter: (a, b) => a.Map.localeCompare(b.Map),
  },
  {
    title: startCase(serverListKeys.mapSize),
    dataIndex: serverListKeys.mapSize,
    key: serverListKeys.mapSize,
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
    title: "Day/Night",
    dataIndex: serverListKeys.dayNight,
    key: serverListKeys.dayNight,
    sorter: (a, b) => a.DayNight.localeCompare(b.DayNight),
    render: (_, record) => {
      const { DayNight } = record;
      const dayFlag = DayNight.toLowerCase().includes("day");
      return <Tag color={dayFlag ? "orange" : "blue"}>{DayNight}</Tag>;
    },
  },
  {
    title: startCase(serverListKeys.hz),
    dataIndex: serverListKeys.hz,
    key: serverListKeys.hz,
    sorter: (a, b) => a.Hz - b.Hz,
    render: (_, record) => {
      const { Hz } = record;
      const HzNum = Number(Hz);
      let color = ""; // default for 60
      if (HzNum < 60) color = "red";
      if (HzNum > 60 && HzNum <= 144) color = "blue";
      if (HzNum > 144) color = "green";
      return <Tag color={color}>{HzNum}</Tag>;
    },
  },
  {
    title: "Official",
    dataIndex: serverListKeys.isOfficial,
    key: serverListKeys.isOfficial,
    sorter: (a, b) => a.IsOfficial.localeCompare(b.IsOfficial),
    render: (_, record) => {
      const { IsOfficial } = record;
      const officialFlag = IsOfficial.toLowerCase() === "official";
      return <Tag color={officialFlag ? "green" : "blue"}>{IsOfficial}</Tag>;
    },
  },
  {
    title: "Password",
    dataIndex: serverListKeys.hasPassword,
    key: serverListKeys.hasPassword,
    sorter: (a, b) => a.HasPassword.localeCompare(b.HasPassword),
    render: (_, record) => {
      const { HasPassword } = record;
      const hasPassFlag = HasPassword.toLowerCase().includes("yes");
      return <Tag color={hasPassFlag ? "red" : "green"}>{HasPassword}</Tag>;
    },
  },
  {
    title: startCase(serverListKeys.antiCheat),
    dataIndex: serverListKeys.antiCheat,
    key: serverListKeys.antiCheat,
    sorter: (a, b) => a.AntiCheat.localeCompare(b.AntiCheat),
  },
  {
    title: startCase(serverListKeys.build),
    dataIndex: serverListKeys.build,
    key: serverListKeys.build,
    sorter: (a, b) => a.Build.localeCompare(b.Build),
  },
];
