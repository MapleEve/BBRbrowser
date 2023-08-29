import { startCase } from "lodash";

export const serverListKeys = {
  name: "Name",
  map: "Map",
  mapSize: "MapSize",
  gamemode: "Gamemode",
  region: "Region",
  players: "Players",
  queuePlayers: "QueuePlayers",
  maxPlayers: "MaxPlayers",
  hz: "Hz",
  dayNight: "DayNight",
  isOfficial: "IsOfficial",
  hasPassword: "HasPassword",
  antiCheat: "AntiCheat",
  build: "Build",
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
    CashRun: "运钞",
    INFCONQ: "步兵征服",
    TDM: "团队死斗",
    GunGameFFA: "个人军备竞赛",
    GunGameTeam: "团队军备竞赛",
    FFA:"个人死斗",
    ELI:"歼灭",
    CatchGame:"躲猫猫",
    SuicideRush:"自杀式突破",
    Infected:"感染",
    CaptureTheFlag:"夺旗",
    VoxelFortify:"方块防御",
  };
  const mapsizeMapping = {
    Tiny: "16",
    Small: "32",
    Medium: "64",
    Big: "128",
    Ultra: "254",
  };
  const flagMapping = {
    america: "🇺🇸",
    australia: "🇦🇺",
    brazil: "🇧🇷",
    europe: "🇪🇺",
    japan: "🇯🇵",
    asia: "🏁",
    developer:"🚩",
  };

  data.forEach((server) => {
    server.key = `${server.Name}_${server.Region}_${server.Map}`;

    // Manipulate data to make it easier to display
    server.IsOfficial = server.IsOfficial ? "官方服" : "社区服";
    server.HasPassword = server.HasPassword ? "密码" : "无";

    // New column for server status (players, queue, max players)
    server.PlayersStatus =
      server.QueuePlayers > 0
        ? `${server.Players}[+${server.QueuePlayers}]/${server.MaxPlayers}`
        : `${server.Players}/${server.MaxPlayers}`;

    // Data for server status color
    if (server.Players + server.QueuePlayers === server.MaxPlayers) {
      server.statusColor = "magenta";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.85) {
      server.statusColor = "red";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.70) {
      server.statusColor = "orange";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.50) {
      server.statusColor = "green";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.25) {
      server.statusColor = "blue";
    } else {
      server.statusColor = "";
    }

    // Gamemode mapping
    Object.keys(gamemodeMapping).forEach((key) => {
      if (String(server.Gamemode).toLowerCase() === key.toLowerCase()) {
        server.Gamemode = gamemodeMapping[key];
      }
    });
    // Mapsize mapping
    Object.keys(mapsizeMapping).forEach((key) => {
      if (String(server.mapSize).toLowerCase() === key.toLowerCase()) {
        server.mapSize = mapsizeMapping[key];
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
      server.DayNight = "☀️ 白天";
    } else if (server.DayNight.toLowerCase() === "night") {
      server.DayNight = "🌙 夜晚";
    }

    // HasPassword mapping
    if (server.HasPassword.toLowerCase() === "密码") {
      server.HasPassword = "🔒 " + server.HasPassword;
    }
  });

  return data;
}
