import React, { useState, useEffect } from "react";
import API from "../api";

export default function TaskList({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending"
  });

  // โหลดงานของ user นี้
  const fetchTasks = useCallback(async () => {
  try {
    setLoading(true);
    const res = await API.get(`/tasks?user=${userId}`);
    setTasks(res.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    setLoading(false);
  }
}, [userId]);

useEffect(() => {
  if (userId) fetchTasks();
}, [userId, fetchTasks]);


  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert("กรุณาใส่ชื่องาน");
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        ...(newTask.dueDate && { dueDate: newTask.dueDate }),
        user: userId   // ✅ ผูกกับ user
      };

      await API.post("/tasks", taskData);
      setNewTask({ title: "", description: "", dueDate: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มงาน");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("เกิดข้อผิดพลาดในการลบงาน");
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await API.put(`/tasks/${id}`, { status: newStatus, user: userId });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      status: task.status || "Pending"
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: "", description: "", dueDate: "", status: "Pending" });
  };

  const saveEdit = async () => {
    try {
      await API.put(`/tasks/${editingTask}`, { ...editForm, user: userId });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกการแก้ไข");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("th-TH");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#ff1500ff";
      case "In Progress": return "#ffb700ff";
      case "Completed": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Pending": return "In Progress";
      case "In Progress": return "Completed";
      case "Completed": return "Pending";
      default: return "Pending";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending": return "รอดำเนินการ";
      case "In Progress": return "กำลังทำ";
      case "Completed": return "เสร็จแล้ว";
      default: return status;
    }
  };

  if (!userId) {
    return <div style={{ textAlign: "center", padding: "20px" }}>❗ กรุณา Login ก่อน</div>;
  }

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>🔄 กำลังโหลด...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📋 Cloud To-Do List</h2>

      {/* ฟอร์มเพิ่มงานใหม่ */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>เพิ่มงานใหม่</h3>
        
        <input 
          type="text" 
          value={newTask.title} 
          onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
          placeholder="ชื่องาน *"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        
        <textarea 
          value={newTask.description} 
          onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
          placeholder="รายละเอียด (ไม่บังคับ)"
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
        
        <input 
          type="date" 
          value={newTask.dueDate} 
          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
          style={{
            width: '200px',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        
        <button 
          onClick={addTask}
          style={{
            backgroundColor: '#c026feff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'block'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ce5ffbff'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ce5ffbff'}
        >
          ➕ เพิ่มงาน
        </button>
      </div>

      {/* รายการงาน */}
      <div>
        <h3 style={{ color: '#495057' }}>
          รายการงาน ({tasks.length} งาน)
        </h3>
        
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
            ยังไม่มีงานในรายการ
          </p>
        ) : (
          <div>
            {tasks.map((task) => (
              <div key={task._id} style={{
                backgroundColor: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {editingTask === task._id ? (
                  // โหมดแก้ไข
                  <div>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      placeholder="ชื่องาน"
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="รายละเอียด"
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                        style={{
                          padding: '8px',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        style={{
                          padding: '8px',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Pending">รอดำเนินการ</option>
                        <option value="In Progress">กำลังทำ</option>
                        <option value="Completed">เสร็จแล้ว</option>
                      </select>
                    </div>
                    
                    <div>
                      <button
                        onClick={saveEdit}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '8px'
                        }}
                      >
                        💾 บันทึก
                      </button>
                      
                      <button
                        onClick={cancelEdit}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ❌ ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  // โหมดแสดงปกติ
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 5px 0', 
                        color: '#212529',
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                        opacity: task.status === 'Completed' ? 0.7 : 1
                      }}>
                        {task.title}
                      </h4>
                      
                      {task.description && (
                        <p style={{ 
                          margin: '0 0 10px 0', 
                          color: '#6c757d',
                          fontSize: '14px'
                        }}>
                          {task.description}
                        </p>
                      )}
                      
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        <span>📅 ครบกำหนด: {formatDate(task.dueDate)}</span>
                        <span style={{ marginLeft: '15px' }}>
                          📝 สร้างเมื่อ: {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ marginLeft: '15px', textAlign: 'right' }}>
                      <div style={{
                        backgroundColor: getStatusColor(task.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        marginBottom: '10px',
                        display: 'inline-block'
                      }}>
                        {getStatusText(task.status)}
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => updateTaskStatus(task._id, getNextStatus(task.status))}
                          style={{
                            backgroundColor: '#c026feff',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginRight: '5px'
                          }}
                        >
                          {task.status === 'Completed' ? '🔄 รีเซ็ต' : 
                           task.status === 'In Progress' ? '✅ เสร็จ' : '▶️ เริ่ม'}
                        </button>
                        
                        <button 
                          onClick={() => startEdit(task)}
                          style={{
                            backgroundColor: '#c026feff',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginRight: '5px'
                          }}
                        >
                          ✏️ แก้ไข
                        </button>
                        
                        <button 
                          onClick={() => deleteTask(task._id)}
                          style={{
                            backgroundColor: '#c026feff',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
