/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useCallback, useState } from 'react';
import { FieldArray } from 'react-hook-form';
import { FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import { UseFieldArrayProps } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

interface useFormSelectReturn<T extends FieldValues>
  extends UseFieldArrayReturn<FieldValues, string | `${string}.${string}`, 'id'> {
  selectIsOpen: boolean;
  selections: string[];
  onToggle: () => void;
  handleSelect: (
    selectedData: Partial<FieldArray<T>> | Partial<FieldArray<T>>[],
    comparatorKey: any
  ) => void;
  onCreate: (
    selectedData: Partial<FieldArray<T>> | Partial<FieldArray<T>>[],
    comparatorKey: any
  ) => void;
  createdSelect: string[];
  onClear: () => void;
}

/**
 * This hook is used for easy controlling patternfly select component using react-hook-form
 */
export const useFormSelect = <T extends FieldValues>(
  props: UseFieldArrayProps<T>
): useFormSelectReturn<T> => {
  const [selectIsOpen, setSelectIsOpen] = useState(false);
  const [createdSelect, setCreatedSelect] = useState<string[]>([]);
  const data = useFieldArray<T>(props);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selections = useMemo(() => data.fields.map((field: any) => field.name), [data.fields]);

  const onToggle = useCallback((isExpanded?: boolean): void => {
    setSelectIsOpen(typeof isExpanded === 'boolean' ? isExpanded : (state) => !state);
  }, []);

  /**
   * Used to handle selects of patternfly onSelect event with react-hook-form
   */
  const handleSelect = useCallback(
    (selectedData: Partial<FieldArray<T>> | Partial<FieldArray<T>>[], comparatorKey: any) => {
      const selectedPosInSelectList = data.fields.findIndex(
        (field: any) => field[comparatorKey] === (selectedData as any)[comparatorKey]
      );
      const selectedPosInCreatedList = data.fields.findIndex(
        (field: any) => field[comparatorKey] === (selectedData as any)[comparatorKey]
      );
      if (selectedPosInSelectList === -1) {
        data.append(selectedData);
      } else {
        data.remove(selectedPosInSelectList);
      }
      if (selectedPosInCreatedList !== -1) {
        setCreatedSelect((state) =>
          state.filter((el) => el !== (selectedData as any)[comparatorKey])
        );
      }
      setSelectIsOpen(false);
    },
    [data]
  );

  const onCreate = useCallback(
    (selectedData: Partial<FieldArray<T>> | Partial<FieldArray<T>>[], comparatorKey: any) => {
      setCreatedSelect((state) => [...state, (selectedData as any)[comparatorKey]]);
      data.append(selectedData);
    },
    [data]
  );

  const onClear = useCallback(() => {
    setCreatedSelect([]);
    data.remove();
  }, [data]);

  return {
    selectIsOpen,
    selections,
    onToggle,
    handleSelect,
    createdSelect,
    onClear,
    onCreate,
    ...data,
  };
};
