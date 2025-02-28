/* eslint-disable react-hooks/exhaustive-deps */
import productTypeApi from "@/apis/modules/productType";
import ConditionDropdown from "@/components/common/ConditionDropdown";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { EFieldByValue, ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IProductType, ISortOrder } from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/ProductType/Edit";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductTableProps {
  productTypes: IProductType[];
  filters: FilterSearch[];
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IProductType>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

interface IBetweenCondition {
  minValue: string;
  maxValue: string;
}

export default function ProductTypeTable({
  productTypes,
  filters,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: ProductTableProps) {
  const [sortOrder, setSortOrder] = useState<ISortOrder<IProductType>>({
    sort: "",
    order: ESortOrderValue.ASC,
  });
  const [fieldBetween, setFieldBetween] = useState<string[]>([]);
  const onConfirmDelete = async (id: string | number) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await productTypeApi.delete(id);
      if (res.error === 0) {
        onDeleted();
      }
    } catch (error) {
      throw error;
    }
  };
  const [searchValues, setSearchValues] = useState({
    ten: { minValue: "", maxValue: "", value: "" },
  });

  const updateFilter = async (
    field: string,
    condition: string,
    value: string,
    betweenValue: IBetweenCondition = { minValue: "", maxValue: "" }
  ) => {
    let updatedFilters = filters;

    updatedFilters = filters.filter((f) => f.field !== field);
    if (condition !== "between") {
      updatedFilters = [...updatedFilters, { field, condition, value }];
    } else {
      updatedFilters = [
        ...updatedFilters,
        { field, condition: ">=", value: String(betweenValue.minValue ?? "") },
        { field, condition: "<=", value: String(betweenValue.maxValue ?? "") },
      ];
    }

    onFilterChange(updatedFilters);
  };

  const debouncedSearchValues = {
    ten: useDebounce(searchValues.ten, 500),
  };

  useEffect(() => {
    const isAllEmpty = Object.keys(debouncedSearchValues).every(
      (key) =>
        !debouncedSearchValues[key as keyof typeof debouncedSearchValues]?.value
    );
    if (isAllEmpty) {
      if (filters.length > 0) {
        onFilterChange([]);
      }
      return;
    }
    Object.keys(debouncedSearchValues).forEach((key) => {
      const currentFilter = filters.find((f) => f.field === key);
      const iscurrentFilterBetween = fieldBetween.some(
        (fieldBetween) => fieldBetween === key
      );
      if (iscurrentFilterBetween) {
        const newValue =
          debouncedSearchValues[key as keyof typeof debouncedSearchValues];
        if (newValue.minValue && newValue.maxValue) {
          if (
            !currentFilter ||
            currentFilter.value !== newValue.minValue ||
            currentFilter.value !== newValue.maxValue
          ) {
            updateFilter(key, "between", "", {
              minValue: newValue.minValue,
              maxValue: newValue.maxValue,
            });
          }
        }
        return;
      }
      const newValue =
        debouncedSearchValues[key as keyof typeof debouncedSearchValues];
      // Chỉ cập nhật filter nếu giá trị mới khác giá trị cũ
      if (!currentFilter || currentFilter.value !== newValue.value) {
        updateFilter(
          key,
          currentFilter?.condition || "contains",
          newValue.value
        );
      }
    });
  }, [debouncedSearchValues, filters, fieldBetween]);

  const handleSearchChange = (
    field: string,
    value: { minValue: string; maxValue: string; value: string }
  ) => {
    setSearchValues((prev) => ({ ...prev, [field]: { ...value } }));
  };

  const handleConditionChange = async (condition: string, field: string) => {
    if (condition !== "between") {
      updateFilter(field, condition, "");
      setFieldBetween((prev) => prev.filter((f) => f !== field));
    } else {
      setFieldBetween((prev) => [...prev, field]);
      setSearchValues((prev) => ({
        ...prev,
        [field]: { minValue: "", maxValue: "", value: "" },
      }));
      updateFilter(field, "between", "");
    }
  };

  const handleSortOrder = (field: keyof IProductType) => {
    setSortOrder((prev) => ({
      sort: field, // Nếu đang sort field này thì bỏ sort
      order:
        prev.sort === field
          ? prev.order === ESortOrderValue.ASC
            ? ESortOrderValue.DESC
            : ESortOrderValue.ASC
          : ESortOrderValue.ASC,
    }));
  };

  useEffect(() => {
    onSortOrder(sortOrder);
  }, [sortOrder, onSortOrder]);

  const renderSortIcon = (field: keyof IProductType) => {
    if (sortOrder.sort === field) {
      return sortOrder.order === ESortOrderValue.ASC ? (
        <ArrowUp size={16} />
      ) : (
        <ArrowDown size={16} />
      );
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSortOrder(EFieldByValue.ID)}>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>ID</span> {renderSortIcon(EFieldByValue.ID)}
            </div>
          </TableHead>
          <TableHead>Hình ảnh </TableHead>
          <TableHead onClick={() => handleSortOrder(EFieldByValue.TEN)}>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>Tên sản phẩm</span> {renderSortIcon(EFieldByValue.TEN)}
            </div>
          </TableHead>
          <TableHead>
            <TableHead onClick={() => handleSortOrder(EFieldByValue.CREATED_AT)}>
              <div className="flex items-center space-x-2 cursor-pointer">
                <span>Ngày tạo</span> {renderSortIcon(EFieldByValue.CREATED_AT)}
              </div>
            </TableHead>
          </TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Ô tìm kiếm */}
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell className="relative">
            <ConditionDropdown
              className="absolute left-5 top-1/2 transform -translate-y-1/2"
              onConditionChange={handleConditionChange}
              name={EFieldByValue.TEN}
              type="text"
            />
            {fieldBetween.some(
              (fieldBetween) => fieldBetween === EFieldByValue.TEN
            ) ? (
              <Popover>
                <PopoverTrigger className="w-full">
                  <Input
                    readOnly={true}
                    placeholder="Nhấp để chọn khoảng giá"
                    className="w-full rounded-md border border-stroke bg-transparent py-3 pl-10 pr-4 text-black outline-none cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2 space-y-2">
                    <Input
                      type="number"
                      value={searchValues.ten.minValue || ""}
                      placeholder="Từ"
                      className="w-full rounded-md border border-stroke bg-white py-3 pl-4 text-black outline-none"
                      onChange={(e) =>
                        handleSearchChange(EFieldByValue.TEN, {
                          minValue: e.target.value,
                          maxValue: searchValues.ten.maxValue || "",
                          value: "",
                        })
                      }
                    />
                    <Input
                      type="number"
                      value={searchValues.ten.maxValue || ""}
                      placeholder="Đến"
                      className="w-full rounded-md border border-stroke bg-white py-3 pl-4 text-black outline-none"
                      onChange={(e) =>
                        handleSearchChange(EFieldByValue.TEN, {
                          minValue: searchValues.ten.minValue || "",
                          maxValue: e.target.value,
                          value: "",
                        })
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Input
                type="search"
                placeholder="Tìm tên sản phẩm"
                value={searchValues.ten.value || ""}
                onChange={(e) =>
                  handleSearchChange(EFieldByValue.TEN, {
                    minValue: "",
                    maxValue: "",
                    value: e.target.value,
                  })
                }
                className="w-full rounded-md border border-stroke bg-transparent py-3 pl-10 pr-4 text-black outline-none"
              />
            )}
          </TableCell>
          <TableCell />
        </TableRow>
        {/* Hiển thị dữ liệu */}
        {productTypes.map((productType) => (
          <TableRow key={productType.ID}>
            <TableCell>{productType.ID}</TableCell>
            <TableCell>
              <img
                src={`${import.meta.env.BASE_URL}/${productType.hinh_anh}`}
                alt={productType.ten}
                className="w-10 h-10"
              />
            </TableCell>
            <TableCell>{productType.ten}</TableCell>
            <TableCell>{convertRFC1123(productType.CreatedAt)}</TableCell>
            <TableCell className="flex space-x-2">
              <Edit
                onEdited={onEdited}
                productType={productType}
                productTypes={productTypes}
              />
              <ConfirmDeleteButton
                id={productType.ID}
                onConfirm={onConfirmDelete}
                title={`Bạn có chắc chắn muốn xóa sản phẩm ${productType.ten}?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
