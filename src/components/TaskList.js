import React, { useState, useEffect } from "react";
import API from "../api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);

  // โหลดงานทั้งหมด
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert("กรุณาใส่ชื่องาน");
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        ...(newTask.dueDate && { dueDate: newTask.dueDate })
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
      await API.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff0000ff';
      case 'In Progress': return '#ffc800ff';
      case 'Completed': return '#2ae656ff';
      default: return '#6c757d';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending': return 'In Progress';
      case 'In Progress': return 'Completed';
      case 'Completed': return 'Pending';
      default: return 'Pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'รอดำเนินการ';
      case 'In Progress': return 'กำลังทำ';
      case 'Completed': return 'เสร็จแล้ว';
      default: return status;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>🔄 กำลังโหลด...</div>;
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
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'block'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
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
                          backgroundColor: '#28a745',
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
                        onClick={() => deleteTask(task._id)}
                        style={{
                          backgroundColor: '#dc3545',
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}