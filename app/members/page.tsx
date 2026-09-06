'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const money = (n: number) =>
  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

type Member = {
  id: number;
  member_no: string;
  national_id?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  joined_at: string;
  status: string;
  balance: number;
};

const emptyForm = {
  member_no: '',
  national_id: '',
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  joined_at: new Date().toISOString().slice(0, 10),
  status: 'active',
};

export default function Members() {
  const [rows, setRows] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const load = async () => {
    try {
      const response = await fetch('/api/members', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'โหลดข้อมูลสมาชิกไม่สำเร็จ');
      }

      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Load members error:', error);
      alert('โหลดข้อมูลสมาชิกไม่สำเร็จ');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const change = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function save(e: FormEvent) {
    e.preventDefault();

    try {
      const url = editing ? `/api/members/${editing.id}` : '/api/members';
      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || 'บันทึกไม่สำเร็จ');
        return;
      }

      setEditing(null);
      setForm({ ...emptyForm, joined_at: new Date().toISOString().slice(0, 10) });
      await load();
    } catch (error) {
      console.error('Save member error:', error);
      alert('ไม่สามารถบันทึกข้อมูลได้');
    }
  }

  function edit(member: Member) {
    setEditing(member);
    setForm({
      member_no: member.member_no || '',
      national_id: member.national_id || '',
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      phone: member.phone || '',
      address: member.address || '',
      joined_at: member.joined_at || new Date().toISOString().slice(0, 10),
      status: member.status || 'active',
    });
  }

  async function remove(member: Member) {
    if (!confirm(`ยืนยันลบ ${member.first_name} ${member.last_name} ?`)) return;

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || 'ลบไม่สำเร็จ');
        return;
      }

      await load();
    } catch (error) {
      console.error('Delete member error:', error);
      alert('ไม่สามารถลบข้อมูลได้');
    }
  }

  const filtered = rows.filter((member) =>
    `${member.member_no} ${member.first_name} ${member.last_name} ${member.phone || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="sidebar w-full p-5 md:w-64">
        <div className="mb-8 text-xl font-bold">💰 เงินออมทรัพย์</div>
        <a className="navitem" href="/">📊 Dashboard</a>
        <a className="navitem active" href="/members">👥 สมาชิก</a>
        <a className="navitem" href="/transactions">📒 รายการเงิน</a>
        <a className="navitem" href="/reports">📈 รายงาน</a>
      </aside>

      <main className="flex-1 p-5 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">👥 สมาชิกเงินออม</h1>
              <p className="text-gray-500">เพิ่ม แก้ไข ค้นหา และจัดการสถานะสมาชิก</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <form onSubmit={save} className="card h-fit p-5">
              <h2 className="mb-4 font-bold">{editing ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิก'}</h2>

              {[
                ['member_no', 'เลขสมาชิก'],
                ['national_id', 'เลขบัตรประชาชน'],
                ['first_name', 'ชื่อ'],
                ['last_name', 'นามสกุล'],
                ['phone', 'เบอร์โทรศัพท์'],
                ['address', 'ที่อยู่'],
              ].map(([key, label]) => (
                <div className="mb-3" key={key}>
                  <label className="mb-1 block text-sm">{label}</label>
                  <input
                    className="input"
                    value={form[key as keyof typeof emptyForm] || ''}
                    onChange={(e) => change(key as keyof typeof emptyForm, e.target.value)}
                    required={key === 'member_no' || key === 'first_name' || key === 'last_name'}
                  />
                </div>
              ))}

              <label className="text-sm">สถานะ</label>
              <select
                className="input mt-1 mb-4"
                value={form.status}
                onChange={(e) => change('status', e.target.value)}
              >
                <option value="active">ใช้งาน</option>
                <option value="inactive">ระงับ</option>
              </select>

              <button className="btn btn-primary w-full">
                {editing ? 'บันทึกการแก้ไข' : 'บันทึกสมาชิก'}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ ...emptyForm, joined_at: new Date().toISOString().slice(0, 10) });
                  }}
                  className="btn mt-2 w-full"
                >
                  ยกเลิก
                </button>
              )}
            </form>

            <div className="card overflow-auto p-5">
              <div className="mb-4 flex gap-3">
                <input
                  className="input"
                  placeholder="ค้นหาเลขสมาชิก ชื่อ หรือเบอร์โทร"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>เลขสมาชิก</th>
                    <th>ชื่อ–สกุล</th>
                    <th>โทรศัพท์</th>
                    <th>ยอดเงินออม</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((member) => (
                    <tr key={member.id}>
                      <td>{member.member_no}</td>
                      <td>{member.first_name} {member.last_name}</td>
                      <td>{member.phone || '-'}</td>
                      <td>{money(Number(member.balance || 0))}</td>
                      <td>{member.status === 'active' ? 'ใช้งาน' : 'ระงับ'}</td>
                      <td className="whitespace-nowrap">
                        <button
                          className="mr-3 text-[#0f4c81]"
                          onClick={() => edit(member)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => void remove(member)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!filtered.length && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
