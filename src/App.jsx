import { useCallback, useEffect, useState } from "react";
import CountUp from 'react-countup';
import {
  Table,
  ConfigProvider,
  theme,
  Layout,
  Button,
  Space,
  Checkbox,
  Col, 
  Row, 
  Statistic,
  Card,
  List, 
  Tag
} from "antd";
import { fetchServerList, serverListKeys } from "./api";
import { tableColumns } from "./columns";
import ServerFilters from "./components/ServerFilters";
import ThemeToggle from "./components/ThemeToggle";
import getStyles from "./styles";
import { LOCAL_STORAGE_KEYS } from "./constants";
import zhCN from 'antd/locale/zh_CN';

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

  const [regionData, regionCounts] = useState([]);

  // 筛选器总数据展示
  const allFilteredServers = () => "列表中有：" + filteredServerList.length + " 服务器";

  const refreshData = useCallback(async () => {
    const res = await fetchServerList();
    setServerList(res.data);
    setFilteredServerList(res.data);

    //console.log(res.data)

    const savedFilters = localStorage.getItem(LOCAL_STORAGE_KEYS.savedFilters);
    if (savedFilters) {
      const newFilters = { ...JSON.parse(savedFilters) };
      applyFilters(res.data, newFilters);
    }

    var regionResult = []
    for(const region in res.regionData){
      const regionObj = {
        region,
        ...res.regionData[region]
      };
      regionResult.push(regionObj);
    }
    regionCounts(regionResult) 

    //console.log(regionResult)
  
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
  
  // 人数计数器初始化
  const formatter = (value) => <CountUp 
        end={value}
        preserveValue="true"
        valueStyle={{
          fontSize: 12,
        }}
        separator="," />;

  document.body.style.backgroundColor =
    themeMode === "dark" ? "black" : "white";

  return (
    <ConfigProvider
      locale={zhCN}
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
          <List
            grid={{ gutter: 16, column: 6 }}
            dataSource={regionData}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.region} 
                    headStyle ={{fontSize: 20, textAlign:"center"}} 
                    bodyStyle={{ textAlign:"center" }}
                    >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic 
                      title={<Tag color={"cyan"}>游戏中</Tag>}
                      value={item.officialPlayers} 
                      formatter={formatter} 
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                      title={<Tag color={"cyan"}>排队</Tag>}
                      value={item.officialQueuePlayers}  
                      formatter={formatter} 
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                      title={<Tag color={"cyan"}>空位</Tag>}
                      value={item.officialSlots}  
                      formatter={formatter} 
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic 
                      title={<Tag color={"gold"}>游戏中</Tag>}
                      value={item.communityPlayers} 
                      formatter={formatter} 
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                      title={<Tag color={"gold"}>排队</Tag>}
                      value={item.communityQueuePlayers}  
                      formatter={formatter} 
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                      title={<Tag color={"gold"}>空位</Tag>}
                      value={item.communitySlots}  
                      formatter={formatter} 
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                      title={<Tag color={"red"}>🔒游戏中</Tag>}
                      value={item.communityPassPlayers} 
                      formatter={formatter} 
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                      title={<Tag color={"red"}>🔒空位</Tag>}
                      value={item.communityPassSlots}  
                      formatter={formatter} 
                      />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
          <Table
            dataSource={filteredServerList}
            columns={tableColumns}
            rowKey="key"
            pagination={{
              total: {allFilteredServers},
              showTotal: ((total) => `总共有 ${total} 组服务器数据`),
              defaultPageSize: 100,
              pageSizeOptions:[100,200,300,500],
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
