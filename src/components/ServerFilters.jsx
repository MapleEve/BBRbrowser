import { Input, Select, Button } from "antd";
import { startCase } from "lodash";
import { serverListKeys } from "../api";

const { Option } = Select;

const ServerFilters = ({
  serverList,
  onFilterChange,
  onClearFilters,
  filters,
}) => {
  const generateSelectFilters = () => {
    if (!serverList || serverList.length === 0) {
      return null; // Return null if serverList is undefined, null, or empty
    }

    const filterFields = Object.keys(serverList[0]);
    const notGeneratedFields = [
      serverListKeys.players,
      serverListKeys.queuePlayers,
      serverListKeys.playersStatus,
      serverListKeys.hasPassword,
      serverListKeys.antiCheat,
      serverListKeys.maxPlayers,
      serverListKeys.key,
      serverListKeys.statusColor,
      serverListKeys.communityPlayers,
      serverListKeys.communityQueuePlayers,
      serverListKeys.communitySlots,
      serverListKeys.officialPlayers,
      serverListKeys.officialQueuePlayers,
      serverListKeys.officialSlots,
      serverListKeys.communityPassPlayers,
      serverListKeys.communityPassSlots,
    ];

    return filterFields.map((field) => {
      if (notGeneratedFields.includes(field)) return null;
      const currentVal = filters[field];
      if (field === serverListKeys.name) {
        return (
          <InputSearchFilter
            key={field}
            field={field}
            placeholder={`搜索${startCase(field)}`}
            onChange={onFilterChange}
            // currentVal={currentVal} // don't save currentVal for input search
          />
        );
      }

      return (
        <SelectFilter
          key={field}
          field={field}
          placeholder={`选择${startCase(field)}`}
          options={uniqueValuesByField(field)}
          onChange={onFilterChange}
          currentVal={currentVal}
        />
      );
    });
  };

  const uniqueValuesByField = (field) => {
    if (!serverList || serverList.length === 0) {
      return []; // 处理空值和未定义情况
    }
    return Array.from(new Set(serverList.map((server) => server[field]))).sort(
      function (a, b) {
        if (!isNaN(a) && !isNaN(b)) {
          return a - b;
        }
        return a.localeCompare(b);
      }
    );
  };

  return (
    <div style={{ padding: "16px 0" }}>
      {generateSelectFilters()}
      <Button onClick={onClearFilters} type="primary">
        重置筛选
      </Button>
    </div>
  );
};

const InputSearchFilter = ({ field, placeholder, onChange }) => {
  const handleInputChange = (e) => {
    onChange(field, e.target.value);
  };

  return (
    <Input
      style={{ width: 200, marginRight: 16 }}
      placeholder={placeholder}
      onChange={handleInputChange}
    />
  );
};

const SelectFilter = ({
  field,
  placeholder,
  options,
  onChange,
  currentVal,
}) => {
  const handleSelectChange = (selectedValues) => {
    onChange(field, selectedValues);
  };
  let defaultValue = [];
  if (currentVal) {
    defaultValue = currentVal;
  }

  return (
    <Select
      style={{ width: 200, marginRight: 16, marginBottom: 8 }}
      placeholder={placeholder}
      mode="multiple" // 多选
      allowClear
      onChange={handleSelectChange}
      defaultValue={defaultValue}>
      {options.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
};

export default ServerFilters;
