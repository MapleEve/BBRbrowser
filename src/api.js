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
  officialPlayers: "OfficialPlayers",
  officialQueuePlayers: "OfficialQueuePlayers",
  officialSlots: "OfficialSlots",
  communityPlayers: "CommunityPlayers",
  communityQueuePlayers: "CommunityQueuePlayers",
  communitySlots: "CommunitySlots",
  communityPassPlayers: "CommunityPassPlayers",
  communityPassSlots: "CommunityPassSlots",
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
    FFA: "个人死斗",
    ELI: "歼灭",
    CatchGame: "躲猫猫",
    SuicideRush: "自杀式突破",
    Infected: "感染",
    CaptureTheFlag: "夺旗",
    VoxelFortify: "方块防御",
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
    africa: "🇿🇦",
    asia: "🌏",
    developer: "🧑🏻‍💻",
  };

  // 初始化列表
  const regionData = {};

  data.forEach((server) => {
    server.key = `${server.Name}_${server.Region}_${server.Map}`;

    // bool转换器
    server.IsOfficial = server.Name.match(/\w{1,3}-\w{1,2}-\w{1,3}/)
      ? "官方服"
      : "社区服";
    server.HasPassword = server.HasPassword ? "私密" : "开放";

    // 服务器状态展示
    server.PlayersStatus =
      server.QueuePlayers > 0
        ? `${server.Players}[+${server.QueuePlayers}]/${server.MaxPlayers}`
        : `${server.Players}/${server.MaxPlayers}`;

    // 服务器数据颜色渲染判断
    if (server.Players + server.QueuePlayers === server.MaxPlayers) {
      server.statusColor = "magenta";
    } else if (
      server.Players + server.QueuePlayers >=
      server.MaxPlayers * 0.85
    ) {
      server.statusColor = "red";
    } else if (
      server.Players + server.QueuePlayers >=
      server.MaxPlayers * 0.7
    ) {
      server.statusColor = "orange";
    } else if (
      server.Players + server.QueuePlayers >=
      server.MaxPlayers * 0.5
    ) {
      server.statusColor = "green";
    } else if (
      server.Players + server.QueuePlayers >=
      server.MaxPlayers * 0.25
    ) {
      server.statusColor = "blue";
    } else {
      server.statusColor = "";
    }

    // 游戏模式转换
    Object.keys(gamemodeMapping).forEach((key) => {
      if (String(server.Gamemode).toLowerCase() === key.toLowerCase()) {
        server.Gamemode = gamemodeMapping[key];
      }
    });
    // 地图大小转换
    Object.keys(mapsizeMapping).forEach((key) => {
      if (String(server.mapSize).toLowerCase() === key.toLowerCase()) {
        server.mapSize = mapsizeMapping[key];
      }
    });

    // 调整地图名称 TODO 地图名称换行加中文mapping
    server.Map = startCase(server.Map);

    // 服务器旗帜替换值
    Object.keys(flagMapping).forEach((key) => {
      if (String(server.Region).toLowerCase().includes(key)) {
        server.Region = flagMapping[key] + " " + startCase(server.Region);
      }
    });

    // 日夜替换值
    if (server.DayNight.toLowerCase() === "day") {
      server.DayNight = "☀️ 白天";
    } else if (server.DayNight.toLowerCase() === "night") {
      server.DayNight = "🌙 夜晚";
    }

    // 有密码的替换值
    if (server.HasPassword.toLowerCase() === "私密") {
      server.HasPassword = "🔒 " + server.HasPassword;
    }

    if (server.IsOfficial.toLowerCase() === "官方服") {
      server.OfficialPlayers = server.Players;
      server.OfficialQueuePlayers = server.QueuePlayers;
      server.OfficialSlots =
        server.MaxPlayers - server.QueuePlayers - server.Players;
      server.CommunityPlayers = 0;
      server.CommunityQueuePlayers = 0;
      server.CommunitySlots = 0;
      server.CommunityPassPlayers = 0;
      server.CommunityPassSlots = 0;
    }

    if (server.IsOfficial.toLowerCase() === "社区服") {
      if (server.HasPassword.toLowerCase() == "开放") {
        server.OfficialPlayers = 0;
        server.OfficialQueuePlayers = 0;
        server.OfficialSlots = 0;
        server.CommunityPlayers = server.Players;
        server.CommunityQueuePlayers = server.QueuePlayers;
        server.CommunitySlots =
          server.MaxPlayers - server.QueuePlayers - server.Players;
        server.CommunityPassPlayers = 0;
        server.CommunityPassSlots = 0;
      } else {
        server.OfficialPlayers = 0;
        server.OfficialQueuePlayers = 0;
        server.OfficialSlots = 0;
        server.CommunityPlayers = 0;
        server.CommunityQueuePlayers = server.QueuePlayers;
        server.CommunitySlots = 0;
        server.CommunityPassPlayers = server.Players;
        server.CommunityPassSlots =
          server.MaxPlayers - server.QueuePlayers - server.Players;
      }
    }

    // 计算区服内各种数据的总数
    if (!regionData[server.Region]) {
      regionData[server.Region] = {
        officialPlayers: 0,
        officialQueuePlayers: 0,
        officialSlots: 0,
        communityPlayers: 0,
        communityQueuePlayers: 0,
        communitySlots: 0,
        communityPassPlayers: 0,
        communityPassSlots: 0,
      };
    }
    regionData[server.Region].officialPlayers += server.OfficialPlayers;
    regionData[server.Region].officialQueuePlayers +=
      server.OfficialQueuePlayers;
    regionData[server.Region].officialSlots += server.OfficialSlots;
    regionData[server.Region].communityPlayers += server.CommunityPlayers;
    regionData[server.Region].communityQueuePlayers +=
      server.CommunityQueuePlayers;
    regionData[server.Region].communitySlots += server.CommunitySlots;
    regionData[server.Region].communityPassPlayers +=
      server.CommunityPassPlayers;
    regionData[server.Region].communityPassSlots += server.CommunityPassSlots;
  });
  const res = {
    data,
    regionData,
  };

  return res;
}
