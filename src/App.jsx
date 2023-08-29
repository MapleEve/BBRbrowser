import { useCallback, useEffect, useState } from "react";
import {
  Table,
  ConfigProvider,
  theme,
  Layout,
  Button,
  Space,
  Checkbox,
} from "antd";
import { fetchServerList, serverListKeys } from "./api";
import { tableColumns } from "./columns";
import ServerFilters from "./components/ServerFilters";
import ThemeToggle from "./components/ThemeToggle";
import getStyles from "./styles";
import { LOCAL_STORAGE_KEYS } from "./constants";

const { Header, Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

const App = () => {
  const [serverList, setServerList] = useState([]);
  const [filteredServerList, setFilteredServerList] = useState([]);
  const [filters, setFilters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEYS.autoRefresh) === "true"
  );
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEYS.themeMode) || "default"
  );
  const [resetFilterKey, setResetFilterKey] = useState(0); // State for resetting ServerFilters
  const styles = getStyles(themeMode);

  const refreshData = useCallback(async () => {
    const data = await fetchServerList();
    setServerList(data);
    setFilteredServerList(data);
    const savedFilters = localStorage.getItem(LOCAL_STORAGE_KEYS.savedFilters);
    if (savedFilters) {
      const newFilters = { ...JSON.parse(savedFilters) };
      applyFilters(data, newFilters);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (autoRefresh) {
      refreshData(); // Initial refresh
      const intervalId = setInterval(() => {
        refreshData();
      }, 3000); // 3 seconds
 
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, refreshData]);

  useEffect(() => {
    // Save filters to local storage
    if (Object.keys(filters).length === 0) {
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const { [serverListKeys.name]: _, ...filterToSave } = filters;
    if (Object.keys(filterToSave).length === 0) {
      return;
    }
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.savedFilters,
      JSON.stringify(filterToSave)
    );
  }, [filters]);

  const handleSetAutoRefresh = (event) => {
    const value = event.target.checked;
    localStorage.setItem(LOCAL_STORAGE_KEYS.autoRefresh, String(value));
    setAutoRefresh(value);
  };

  const applyFilters = (serverList, newFilters) => {
    setFilters(newFilters);
    const filteredData = serverList.filter((server) => {
      return Object.entries(newFilters).every(([filterKey, filterValues]) => {
        if (!filterValues || filterValues.length === 0) return true; // Skip if filter is empty
        const serverValue = String(server[filterKey]).toLowerCase();
        if (!Array.isArray(filterValues)) {
          return serverValue.includes(String(filterValues).toLowerCase());
        }
        return filterValues.some((filterValue) =>
          serverValue.includes(String(filterValue).toLowerCase())
        );
      });
    });
    setFilteredServerList(filteredData);
  };

  const handleFilterChange = (field, values) => {
    const newFilters = { ...filters, [field]: values };
    applyFilters(serverList, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilteredServerList(serverList);
    setResetFilterKey((prevKey) => prevKey + 1); // Update resetKey to remount ServerFilters
    localStorage.removeItem(LOCAL_STORAGE_KEYS.savedFilters);
  };

  const toggleTheme = () => {
    const newThemeMode = themeMode === "default" ? "dark" : "default";
    setThemeMode(newThemeMode);
    localStorage.setItem("themeMode", newThemeMode);
  };

  document.body.style.backgroundColor =
    themeMode === "dark" ? "black" : "white";

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout>
        <Header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1>兰博像素战地服务器列表监控</h1>
          </div>

          <Space style={styles.headerRight}>
            <Button type="primary" onClick={refreshData}>
              立即刷新
            </Button>
            <Checkbox
              checked={autoRefresh}
              onChange={(event) => handleSetAutoRefresh(event)}
            >
              <div style={{ color: "white" }}>3秒自动刷新</div>
            </Checkbox>
            <ThemeToggle themeMode={themeMode} toggleTheme={toggleTheme} />
          </Space>
        </Header>
        <Content style={styles.content}>
          <ServerFilters
            key={resetFilterKey} // Update key to remount ServerFilters
            serverList={serverList}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filters={filters}
          />

          <Table
            dataSource={filteredServerList}
            columns={tableColumns}
            rowKey="key"
            pagination={{
              defaultPageSize: 100,
              hideOnSinglePage: true,
              position: ["bottomCenter", "topCenter"],
            }}
            scroll={{
              x: "40",
              //
              // y: "calc(100vh - 300px)",
            }}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
