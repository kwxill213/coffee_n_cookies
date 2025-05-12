"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Save, X, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

type DataTable = {
  id: number;
  name: string;
  recordCount: number;
  columns: string[];
  data: Record<string, any>[];
};

export default function TablesPage() {
  const { toast } = useToast();
  const [tables, setTables] = useState<DataTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<DataTable | null>(null);
  const [editingRow, setEditingRow] = useState<{rowId: number} | null>(null);
  const [editData, setEditData] = useState<Record<string, any> | null>(null);
  const [newRowData, setNewRowData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [relatedTablesData, setRelatedTablesData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/admin/tables');
        const { tables: tablesMeta } = await response.json();
        
        setTables(tablesMeta.map((table: any) => ({
          id: table.name,
          name: table.name,
          recordCount: 0,
          columns: [],
          data: []
        })));
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список таблиц",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  const loadTableData = async (tableId: string) => {
    try {
      const res = await fetch(`/api/admin/tables/${tableId}`);
      const { data } = await res.json();
      
      const table = tables.find(t => t.id === tableId);
      if (table) {
        setSelectedTable({
          ...table,
          data: data.map((row: any) => ({
            ...row,
            id: String(row.id),
          })),
          recordCount: data.length,
          columns: data.length > 0 ? Object.keys(data[0]) : []
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: `Не удалось загрузить данные таблицы ${tableId}`,
        variant: "destructive",
      });
    }
  };

  const handleTableSelect = async (tableId: string) => {
    setIsLoading(true);
    await loadTableData(tableId);
    setIsLoading(false);
  };

  const closeTable = () => {
    setSelectedTable(null);
    setEditingRow(null);
    setEditData(null);
    setNewRowData(null);
  };

  const startEdit = (row: any) => {
    setEditingRow({ rowId: row.id });
    setEditData({ ...row });
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditData(null);
  };

  const saveEdit = async () => {
    if (!selectedTable || !editingRow || !editData) return;
    
    try {
      const dataToUpdate = selectedTable.columns.reduce((acc, column) => {
        if (editData[column] !== undefined) {
          acc[column] = editData[column];
        }
        return acc;
      }, {} as Record<string, any>);
  
      const response = await fetch(`/api/admin/tables/${selectedTable.id}/${editingRow.rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate)
      });
      
      if (!response.ok) throw new Error('Ошибка обновления');
      
      const { data: updatedRow } = await response.json();
      
      setSelectedTable({
        ...selectedTable,
        data: selectedTable.data.map(row => 
          row.id === editingRow.rowId ? { ...row, ...updatedRow } : row
        )
      });
      
      toast({
        title: "Успешно!",
        description: "Данные обновлены",
      });
      
      setEditingRow(null);
      setEditData(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные",
        variant: "destructive",
      });
    }
  };

  const deleteRow = async (rowId: number) => {
  if (!selectedTable) return;
  
  try {
    const response = await fetch(`/api/admin/tables/${selectedTable.id}/${rowId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Не удалось удалить запись');
    }
    
    setSelectedTable({
      ...selectedTable,
      data: selectedTable.data.filter(row => row.id !== rowId),
      recordCount: selectedTable.recordCount - 1
    });
    
    toast({
      title: "Успешно!",
      description: "Запись удалена",
    });
  } catch (error) {
    console.error('Delete error:', error);
    toast({
      title: "Ошибка",
      description: error instanceof Error ? error.message : "Не удалось удалить запись",
      variant: "destructive",
    });
  }
};

  const startAddNewRow = () => {
    if (!selectedTable || selectedTable.columns.length === 0) return;
    
    const emptyRow = selectedTable.columns.reduce((acc, col) => {
      acc[col] = '';
      return acc;
    }, {} as Record<string, any>);
    setNewRowData(emptyRow);
  };

  const saveNewRow = async () => {
    if (!selectedTable || !newRowData) return;
    
    try {
      const dataToSend = Object.keys(newRowData).reduce((acc, key) => {
        if (key === 'id') return acc;
        acc[key] = newRowData[key] === '' ? null : newRowData[key];
        return acc;
      }, {} as Record<string, any>);
  
      const response = await fetch(`/api/admin/tables/${selectedTable.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось добавить запись');
      }
      
      const { data: createdRow } = await response.json();
      
      setSelectedTable(prev => {
        if (!prev) return null;
        return {
          ...prev,
          data: [...prev.data, createdRow],
          recordCount: prev.recordCount + 1
        };
      });
      
      toast({
        title: "Успешно!",
        description: "Новая запись добавлена",
      });
      
      setNewRowData(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось добавить запись",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
      }

      const { imageUrl } = await response.json();
      return imageUrl;
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, column: string, isNewRow: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = await uploadImage(file);

      if (imageUrl) {
        if (isNewRow && newRowData) {
          setNewRowData({
            ...newRowData,
            [column]: imageUrl
          });
        } else if (editData) {
          setEditData({
            ...editData,
            [column]: imageUrl
          });
        }
      }
    }
  };

  const loadRelatedTableData = async (tableName: string) => {
    try {
      const res = await fetch(`/api/admin/tables/${tableName}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const { data } = await res.json();
      setRelatedTablesData(prev => ({ ...prev, [tableName]: data }));
    } catch (error) {
      console.error('Ошибка загрузки связанной таблицы:', error);
    }
  };

  const renderCellContent = (row: any, column: string) => {
    if (column === 'image_url' && row[column]) {
      return (
        <div className="relative w-16 h-16">
          <Image
            src={row[column]}
            alt="Image"
            fill
            className="object-cover rounded"
            unoptimized 
          />
        </div>
      );
    }
    return String(row[column]);
  };

  const renderEditableCell = (column: string, isNewRow: boolean = false) => {
    if (column === 'image_url') {
      return (
        <div className="relative">
          <input
            type="file"
            id={`file-upload-${column}`}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageChange(e, column, isNewRow)}
          />
          <label
            htmlFor={`file-upload-${column}`}
            className="cursor-pointer border rounded p-1 flex items-center justify-center text-sm"
          >
            {isUploading ? 'Загрузка...' : 'Выбрать изображение'}
          </label>
          {(isNewRow ? newRowData?.[column] : editData?.[column]) && (
            <div className="mt-2 relative w-16 h-16">
              <Image
                src={(isNewRow ? newRowData?.[column] : editData?.[column]) as string}
                alt="Preview"
                fill
                className="object-cover rounded"
                unoptimized
              />
            </div>
          )}
        </div>
      );
    }
    if (column === 'category') {
      const relatedTable = 'Category';
      
      if (!relatedTablesData[relatedTable] && !relatedTablesData[`${relatedTable}_error`]) {
        loadRelatedTableData(relatedTable);
        return <div className="text-sm text-gray-500">Загрузка категорий...</div>;
      }
    
      if (relatedTablesData[`${relatedTable}_error`]) {
        return <div className="text-red-500 text-sm">Ошибка загрузки</div>;
      }
    
      // Находим выбранную категорию для отображения
      const selectedValue = isNewRow ? newRowData?.[column] : editData?.[column];
      const selectedCategory = relatedTablesData[relatedTable]?.find(
        item => item.id === selectedValue
      );
    
      return (
        <div className="flex flex-col gap-2">
          {/* Поле с выбранным значением */}
          {selectedValue && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <span>{selectedCategory?.name || `ID: ${selectedValue}`}</span>
            </div>
          )}
          
          {/* Выпадающий список */}
          <Select
            value={selectedValue || ''}
            onValueChange={(value) => {
              if (isNewRow && newRowData) {
                setNewRowData({ ...newRowData, [column]: value });
              } else if (editData) {
                setEditData({ ...editData, [column]: value });
              }
            }}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-amber-500">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent className="z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {relatedTablesData[relatedTable]?.map(item => (
                <SelectItem 
                  key={item.id}
                  value={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <span className="block truncate">
                    {item.name || `Категория ${item.id}`}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    return (
      <Input
        value={(isNewRow ? newRowData?.[column] : editData?.[column]) || ''}
        onChange={(e) => {
          if (isNewRow && newRowData) {
            setNewRowData({
              ...newRowData,
              [column]: e.target.value
            });
          } else if (editData) {
            setEditData({
              ...editData,
              [column]: e.target.value
            });
          }
        }}
        className="h-8"
      />
    );
  };

  if (isLoading && !selectedTable) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (selectedTable) {
    return (
      <div className="p-6 h-screen flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={closeTable}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад к списку
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {selectedTable.name}
              <span className="text-sm text-gray-500 ml-2">
                ({selectedTable.recordCount} записей)
              </span>
            </h2>
          </div>
          
          <Button 
            onClick={startAddNewRow}
            disabled={selectedTable.columns.length === 0}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить запись
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
          {selectedTable.columns.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Таблица пуста</p>
            </div>
          ) : (
            <div className="overflow-auto flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    {selectedTable.columns.map(column => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                    <TableHead className="w-32">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newRowData && (
                    <TableRow>
                      {selectedTable.columns.map(column => (
                        <TableCell key={`new-${column}`}>
                          {renderEditableCell(column, true)}
                        </TableCell>
                      ))}
                      <TableCell className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={saveNewRow}
                          disabled={isUploading}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setNewRowData(null)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {selectedTable.data.map(row => (
                    row?.id !== undefined ? (
                      <TableRow key={row.id}>
                        {selectedTable.columns.map(column => (
                          <TableCell key={`${row.id}-${column}`}>
                            {editingRow?.rowId === row.id ? (
                              renderEditableCell(column)
                            ) : (
                              renderCellContent(row, column)
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="flex space-x-2">
                          {editingRow?.rowId === row.id ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={saveEdit}
                                disabled={isUploading}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={cancelEdit}
                                disabled={isUploading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => startEdit(row)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteRow(row.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : null
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление таблицами</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(table => (
          <div 
            key={table.id} 
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleTableSelect(table.id)}
          >
            <h3 className="font-medium">{table.name}</h3>
            <p className="text-sm text-gray-500">
              {table.recordCount > 0 ? `${table.recordCount} записей` : 'Нажмите для загрузки'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}