import { startCase } from "lodash";

export const serverListKeys = {
  name: "服务器名",
  map: "地图",
  mapSize: "地图大小",
  gamemode: "游戏模式",
  region: "区服",
  players: "玩家数",
  queuePlayers: "队列人数",
  maxPlayers: "最大人数",
  hz: "Tickrate",
  dayNight: "日夜",
  isOfficial: "官方服",
  hasPassword: "密码",
  antiCheat: "反作弊",
  build: "版本号",
  // added keys
  key: "key",
  playersStatus: "PlayersStatus",
  statusColor: "statusColor",
};

export async function fetchServerList() {
  const response = await fetch(
    "https://publicapi.battlebit.cloud/Servers/GetServerList"
  );
  const data = await response.json();
  const gamemodeMapping = {
    DOMI: "抢攻",
    CONQ: "征服",
    RUSH: "突破",
    FRONTLINE: "前线",
    CashRun: "Cash Run",
    INFCONQ: "步兵征服",
    TDM: "Team Deathmatch",
    GunGameFFA: "Gun Game Free For All",
  };
  const flagMapping = {
    america: "🇺🇸",
    australia: "🇦🇺",
    brazil: "🇧🇷",
    europe: "🇪🇺",
    japan: "🇯🇵",
    singapore: "🇸🇬",
    vietnam: "🇻🇳",
  };

  data.forEach((server) => {
    server.key = `${server.Name}_${server.Region}_${server.Map}`;

    // Manipulate data to make it easier to display
    server.IsOfficial = server.IsOfficial ? "Official" : "Community";
    server.HasPassword = server.HasPassword ? "Yes" : "No";

    // New column for server status (players, queue, max players)
    server.PlayersStatus =
      server.QueuePlayers > 0
        ? `${server.Players}[+${server.QueuePlayers}]/${server.MaxPlayers}`
        : `${server.Players}/${server.MaxPlayers}`;

    // Data for server status color
    if (server.Players + server.QueuePlayers === server.MaxPlayers) {
      server.statusColor = "red";
    } else if (server.Players + server.QueuePlayers >= 0) {
      server.statusColor = "green";
    } else {
      server.statusColor = "";
    }

    // Gamemode mapping
    Object.keys(gamemodeMapping).forEach((key) => {
      if (String(server.Gamemode).toLowerCase() === key.toLowerCase()) {
        server.Gamemode = gamemodeMapping[key];
      }
    });

    // Map name formatting
    server.Map = startCase(server.Map);

    // Flag mapping
    Object.keys(flagMapping).forEach((key) => {
      if (String(server.Region).toLowerCase().includes(key)) {
        server.Region = flagMapping[key] + " " + startCase(server.Region);
      }
    });

    // Day/Night mapping
    if (server.DayNight.toLowerCase() === "day") {
      server.DayNight = "☀️ " + server.DayNight;
    } else if (server.DayNight.toLowerCase() === "night") {
      server.DayNight = "🌙 " + server.DayNight;
    }

    // HasPassword mapping
    if (server.HasPassword.toLowerCase() === "yes") {
      server.HasPassword = "🔒 " + server.HasPassword;
    }
  });

  return data;
}
