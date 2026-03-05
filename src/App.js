import { useState, useEffect, useCallback, useRef } from 'react';
import React from 'react';
// ─── DATA STORES ────────────────────────────────────────────────────────────

const INITIAL_ALARMS = [
  {
    id: 'ALM001',
    severity: 'Critical',
    node: 'Router-Core-01',
    type: 'Link Down',
    location: 'Mumbai DC',
    time: '09:12:34',
    status: 'Active',
    service: 'MPLS-Backbone',
    affected: 1240,
  },
  {
    id: 'ALM002',
    severity: 'Major',
    node: 'BTS-Chennai-42',
    type: 'High CPU',
    location: 'Chennai Zone-4',
    time: '09:18:11',
    status: 'Active',
    service: '4G-LTE',
    affected: 320,
  },
  {
    id: 'ALM003',
    severity: 'Minor',
    node: 'Switch-Edge-07',
    type: 'Port Flapping',
    location: 'Delhi NOC',
    time: '09:22:05',
    status: 'Acknowledged',
    service: 'Enterprise-LAN',
    affected: 45,
  },
  {
    id: 'ALM004',
    severity: 'Warning',
    node: 'OLT-Pune-03',
    type: 'High Temp',
    location: 'Pune Hub',
    time: '09:30:17',
    status: 'Active',
    service: 'FTTH',
    affected: 88,
  },
  {
    id: 'ALM005',
    severity: 'Critical',
    node: 'Gateway-BGP-02',
    type: 'BGP Session Down',
    location: 'Hyderabad DC',
    time: '09:35:49',
    status: 'Active',
    service: 'Internet-Peering',
    affected: 5600,
  },
  {
    id: 'ALM006',
    severity: 'Major',
    node: 'MSC-Bengaluru-01',
    type: 'Signaling Overload',
    location: 'Bengaluru Core',
    time: '09:41:22',
    status: 'Active',
    service: 'Voice-Core',
    affected: 780,
  },
];

const INITIAL_TICKETS = [
  {
    id: 'TT-20241',
    title: 'BGP Session Down — HYD DC',
    priority: 'P1',
    status: 'In Progress',
    assignee: 'Ravi Kumar',
    created: '2024-03-05 09:36',
    sla: '2h',
    slaRemaining: 87,
    alarmId: 'ALM005',
  },
  {
    id: 'TT-20240',
    title: 'Core Router Link Failure — MUM',
    priority: 'P1',
    status: 'Open',
    assignee: 'Priya Nair',
    created: '2024-03-05 09:13',
    sla: '2h',
    slaRemaining: 52,
    alarmId: 'ALM001',
  },
  {
    id: 'TT-20239',
    title: 'BTS High CPU — CHN Zone-4',
    priority: 'P2',
    status: 'In Progress',
    assignee: 'Amit Shah',
    created: '2024-03-05 09:19',
    sla: '4h',
    slaRemaining: 210,
    alarmId: 'ALM002',
  },
  {
    id: 'TT-20238',
    title: 'OLT Thermal Alert — Pune',
    priority: 'P3',
    status: 'Open',
    assignee: 'Unassigned',
    created: '2024-03-05 09:31',
    sla: '8h',
    slaRemaining: 460,
    alarmId: 'ALM004',
  },
  {
    id: 'TT-20237',
    title: 'MSC Signaling Overload',
    priority: 'P2',
    status: 'Resolved',
    assignee: 'Deepa Menon',
    created: '2024-03-04 22:10',
    sla: '4h',
    slaRemaining: 0,
    alarmId: 'ALM006',
  },
];

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Reliance Industries Ltd',
    plan: 'Enterprise Plus',
    status: 'Active',
    balance: 485000,
    due: '2024-03-15',
    invoices: 12,
    lastPayment: '2024-02-15',
    usage: 92,
  },
  {
    id: 'CUST-002',
    name: 'TCS Digital Services',
    plan: 'Business Pro',
    status: 'Active',
    balance: 128000,
    due: '2024-03-20',
    invoices: 8,
    lastPayment: '2024-02-20',
    usage: 67,
  },
  {
    id: 'CUST-003',
    name: 'HDFC Bank Operations',
    plan: 'Enterprise Plus',
    status: 'Suspended',
    balance: -32000,
    due: '2024-02-28',
    invoices: 15,
    lastPayment: '2024-01-28',
    usage: 0,
  },
  {
    id: 'CUST-004',
    name: 'Mahindra Tech',
    plan: 'Business Standard',
    status: 'Active',
    balance: 54000,
    due: '2024-03-25',
    invoices: 6,
    lastPayment: '2024-02-25',
    usage: 45,
  },
  {
    id: 'CUST-005',
    name: 'Infosys BPO',
    plan: 'Enterprise Plus',
    status: 'Active',
    balance: 215000,
    due: '2024-03-18',
    invoices: 11,
    lastPayment: '2024-02-18',
    usage: 78,
  },
];

const INITIAL_INVOICES = [
  {
    id: 'INV-9841',
    customer: 'Reliance Industries Ltd',
    amount: 485000,
    status: 'Pending',
    due: '2024-03-15',
    period: 'Feb 2024',
    services: ['MPLS', 'Internet', 'VoIP'],
  },
  {
    id: 'INV-9840',
    customer: 'TCS Digital Services',
    amount: 128000,
    status: 'Paid',
    due: '2024-03-20',
    period: 'Feb 2024',
    services: ['MPLS', 'Cloud Connect'],
  },
  {
    id: 'INV-9839',
    customer: 'HDFC Bank Operations',
    amount: 32000,
    status: 'Overdue',
    due: '2024-02-28',
    period: 'Jan 2024',
    services: ['Leased Line'],
  },
  {
    id: 'INV-9838',
    customer: 'Mahindra Tech',
    amount: 54000,
    status: 'Paid',
    due: '2024-03-25',
    period: 'Feb 2024',
    services: ['Internet', 'VPN'],
  },
  {
    id: 'INV-9837',
    customer: 'Infosys BPO',
    amount: 215000,
    status: 'Pending',
    due: '2024-03-18',
    period: 'Feb 2024',
    services: ['MPLS', 'Internet', 'SD-WAN'],
  },
];

const NETWORK_NODES = [
  {
    id: 'n1',
    label: 'Core-Router-MUM',
    x: 300,
    y: 200,
    status: 'fault',
    type: 'router',
  },
  {
    id: 'n2',
    label: 'Core-Router-DEL',
    x: 200,
    y: 100,
    status: 'ok',
    type: 'router',
  },
  {
    id: 'n3',
    label: 'Core-Router-BLR',
    x: 400,
    y: 300,
    status: 'ok',
    type: 'router',
  },
  {
    id: 'n4',
    label: 'BGP-GW-HYD',
    x: 500,
    y: 150,
    status: 'fault',
    type: 'gateway',
  },
  {
    id: 'n5',
    label: 'Switch-CHN-42',
    x: 150,
    y: 280,
    status: 'warn',
    type: 'switch',
  },
  {
    id: 'n6',
    label: 'OLT-PUNE-03',
    x: 280,
    y: 340,
    status: 'warn',
    type: 'olt',
  },
  { id: 'n7', label: 'MSC-BLR-01', x: 450, y: 280, status: 'ok', type: 'msc' },
  {
    id: 'n8',
    label: 'Internet-Edge',
    x: 580,
    y: 80,
    status: 'fault',
    type: 'router',
  },
];

const LINKS = [
  { from: 'n1', to: 'n2' },
  { from: 'n1', to: 'n3' },
  { from: 'n1', to: 'n4' },
  { from: 'n2', to: 'n5' },
  { from: 'n3', to: 'n6' },
  { from: 'n3', to: 'n7' },
  { from: 'n4', to: 'n8' },
  { from: 'n2', to: 'n4' },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Outfit',sans-serif;background:#040d14;color:#c8dde8;overflow:hidden}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:#071220}
  ::-webkit-scrollbar-thumb{background:#1a3a52;border-radius:4px}
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────

const SEV_COLOR = {
  Critical: '#ff3b5c',
  Major: '#ff8c00',
  Minor: '#f5c518',
  Warning: '#4fc3f7',
  Info: '#7c9',
};
const SEV_BG = {
  Critical: 'rgba(255,59,92,0.12)',
  Major: 'rgba(255,140,0,0.12)',
  Minor: 'rgba(245,197,24,0.12)',
  Warning: 'rgba(79,195,247,0.12)',
};
const STATUS_COLOR = {
  Active: '#ff3b5c',
  Acknowledged: '#f5c518',
  Cleared: '#26de81',
  Resolved: '#26de81',
  Open: '#ff8c00',
  'In Progress': '#4fc3f7',
};
const PRIO_COLOR = { P1: '#ff3b5c', P2: '#ff8c00', P3: '#f5c518', P4: '#7ab' };
const INV_COLOR = { Paid: '#26de81', Pending: '#f5c518', Overdue: '#ff3b5c' };
const fmt = (n) => (n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`);

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontFamily: "'JetBrains Mono',monospace",
        fontWeight: 700,
        color,
        background: bg || color + '22',
        border: `1px solid ${color}44`,
        padding: '2px 8px',
        borderRadius: 4,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </span>
  );
}

function KpiCard({ label, value, sub, color = '#00c8ff', icon }) {
  return (
    <div
      style={{
        background: '#071a28',
        border: '1px solid #0d2d42',
        borderRadius: 12,
        padding: '20px 24px',
        flex: 1,
        minWidth: 140,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: color,
        }}
      />
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color,
          fontFamily: "'JetBrains Mono',monospace",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#4a7a96',
          marginTop: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: '#2a5a72', marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#e0f0fc' }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: '#3a6a88', marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: '#0a3d5c',
            border: '1px solid #1a5a7c',
            color: '#4fc3f7',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ─── VIEWS ──────────────────────────────────────────────────────────────────

function Dashboard({ alarms, tickets, customers, invoices }) {
  const critActive = alarms.filter(
    (a) => a.severity === 'Critical' && a.status === 'Active'
  ).length;
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length;
  const revenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === 'Overdue').length;

  const recentAlarms = [...alarms]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 4);

  return (
    <div
      style={{
        padding: '24px',
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#e0f0fc' }}>
          Operations Overview
        </div>
        <div style={{ fontSize: 13, color: '#3a6a88' }}>
          Live Network & Business Intelligence — {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPIs Row 1 - OSS */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono',monospace",
            color: '#4fc3f7',
            letterSpacing: '0.2em',
            marginBottom: 12,
          }}
        >
          ◈ OSS — NETWORK STATUS
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <KpiCard
            label="Critical Alarms"
            value={critActive}
            sub="Needs immediate action"
            color="#ff3b5c"
            icon="🚨"
          />
          <KpiCard
            label="Active Alarms"
            value={alarms.filter((a) => a.status === 'Active').length}
            sub="Across all nodes"
            color="#ff8c00"
            icon="⚡"
          />
          <KpiCard
            label="Open Tickets"
            value={openTickets}
            sub="In progress & open"
            color="#f5c518"
            icon="🎫"
          />
          <KpiCard
            label="Network Uptime"
            value="99.2%"
            sub="Last 30 days"
            color="#26de81"
            icon="📡"
          />
          <KpiCard
            label="Nodes Monitored"
            value="842"
            sub="Routers, BTS, OLT"
            color="#00c8ff"
            icon="🗺️"
          />
        </div>
      </div>

      {/* KPIs Row 2 - BSS */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono',monospace",
            color: '#26de81',
            letterSpacing: '0.2em',
            marginBottom: 12,
          }}
        >
          ◈ BSS — BUSINESS STATUS
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <KpiCard
            label="Revenue Collected"
            value={fmt(revenue)}
            sub="This billing cycle"
            color="#26de81"
            icon="💰"
          />
          <KpiCard
            label="Overdue Invoices"
            value={overdue}
            sub="Needs follow-up"
            color="#ff3b5c"
            icon="🧾"
          />
          <KpiCard
            label="Active Customers"
            value={customers.filter((c) => c.status === 'Active').length}
            sub="Enterprise accounts"
            color="#00c8ff"
            icon="👥"
          />
          <KpiCard
            label="Total Revenue"
            value={fmt(invoices.reduce((s, i) => s + i.amount, 0))}
            sub="All invoices this period"
            color="#a78bfa"
            icon="📊"
          />
          <KpiCard
            label="Suspended"
            value={customers.filter((c) => c.status === 'Suspended').length}
            sub="Accounts on hold"
            color="#ff8c00"
            icon="⛔"
          />
        </div>
      </div>

      {/* Recent Alarms + Top Customers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div
          style={{
            background: '#071a28',
            border: '1px solid #0d2d42',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <SectionHeader title="Recent Alarms" sub="Live feed" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentAlarms.map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: SEV_BG[a.severity],
                  borderRadius: 8,
                  border: `1px solid ${SEV_COLOR[a.severity]}22`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: SEV_COLOR[a.severity],
                    boxShadow:
                      a.status === 'Active'
                        ? `0 0 8px ${SEV_COLOR[a.severity]}`
                        : 'none',
                    animation:
                      a.status === 'Active' ? 'pulse 1.5s infinite' : 'none',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: '#c8dde8' }}
                  >
                    {a.type}
                  </div>
                  <div style={{ fontSize: 11, color: '#4a7a96' }}>
                    {a.node} · {a.time}
                  </div>
                </div>
                <Badge label={a.severity} color={SEV_COLOR[a.severity]} />
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: '#071a28',
            border: '1px solid #0d2d42',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <SectionHeader
            title="Customer Billing Snapshot"
            sub="Top enterprise accounts"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {customers.slice(0, 4).map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: '#040d14',
                  borderRadius: 8,
                  border: '1px solid #0d2d42',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#c8dde8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 160,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#4a7a96' }}>
                    Due: {c.due}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 13,
                    color: '#e0f0fc',
                  }}
                >
                  ₹{c.balance.toLocaleString()}
                </div>
                <Badge
                  label={c.status}
                  color={
                    c.status === 'Active'
                      ? '#26de81'
                      : c.status === 'Suspended'
                      ? '#ff3b5c'
                      : '#f5c518'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

function FaultManagement({ alarms, setAlarms, tickets, setTickets }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const DEPARTMENTS = [
    'NOC — Network Operations Center',
    'Core Network Engineering',
    'Access Network Engineering',
    'Radio / RAN Engineering',
    'IP & Transport Engineering',
    'Field Operations & Maintenance',
    'IT Infrastructure Support',
    'Security Operations Center',
    'Transmission Engineering',
    'Billing & Revenue Assurance',
  ];

  const [newTicket, setNewTicket] = useState({
    title: '',
    priority: 'P2',
    department: 'NOC — Network Operations Center',
  });

  const sevs = ['All', 'Critical', 'Major', 'Minor', 'Warning'];
  const filtered =
    filter === 'All' ? alarms : alarms.filter((a) => a.severity === filter);

  const ack = (id) =>
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a))
    );
  const clear = (id) =>
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cleared' } : a))
    );

  const createTicket = () => {
    if (!newTicket.title) return;
    const t = {
      id: `TT-${20242 + tickets.length}`,
      title: newTicket.title,
      priority: newTicket.priority,
      status: 'Open',
      assignee: newTicket.department,
      created: new Date().toLocaleString(),
      sla:
        newTicket.priority === 'P1'
          ? '2h'
          : newTicket.priority === 'P2'
          ? '4h'
          : '8h',
      slaRemaining:
        newTicket.priority === 'P1'
          ? 120
          : newTicket.priority === 'P2'
          ? 240
          : 480,
      alarmId: selected?.id || '',
    };
    setTickets((prev) => [t, ...prev]);
    setShowTicketForm(false);
    setNewTicket({
      title: '',
      priority: 'P2',
      department: 'NOC — Network Operations Center',
    });
  };

  return (
    <div
      style={{
        padding: 24,
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#e0f0fc' }}>
            Fault Management
          </div>
          <div style={{ fontSize: 13, color: '#3a6a88' }}>
            Real-time alarm monitoring & trouble ticket management
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {sevs.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: "'Outfit',sans-serif",
                background:
                  filter === s ? SEV_COLOR[s] || '#0a3d5c' : '#071a28',
                border: `1px solid ${
                  filter === s ? SEV_COLOR[s] || '#1a5a7c' : '#0d2d42'
                }`,
                color:
                  filter === s
                    ? s === 'All'
                      ? '#4fc3f7'
                      : SEV_COLOR[s]
                    : '#4a7a96',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 16,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Alarm Table */}
        <div
          style={{
            background: '#071a28',
            border: '1px solid #0d2d42',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid #0d2d42',
              display: 'grid',
              gridTemplateColumns: '80px 90px 1fr 1fr 90px 90px 100px',
              gap: 8,
              fontSize: 11,
              fontFamily: "'JetBrains Mono',monospace",
              color: '#2a5a72',
              letterSpacing: '0.1em',
            }}
          >
            <span>ALARM ID</span>
            <span>SEVERITY</span>
            <span>NODE</span>
            <span>TYPE</span>
            <span>TIME</span>
            <span>AFFECTED</span>
            <span>STATUS</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #071a28',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: '80px 90px 1fr 1fr 90px 90px 100px',
                  gap: 8,
                  alignItems: 'center',
                  background: selected?.id === a.id ? '#0a2030' : 'transparent',
                  borderLeft:
                    selected?.id === a.id
                      ? `3px solid ${SEV_COLOR[a.severity]}`
                      : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12,
                    color: '#4a7a96',
                  }}
                >
                  {a.id}
                </span>
                <Badge label={a.severity} color={SEV_COLOR[a.severity]} />
                <span
                  style={{ fontSize: 13, color: '#c8dde8', fontWeight: 500 }}
                >
                  {a.node}
                </span>
                <span style={{ fontSize: 13, color: '#8aabbc' }}>{a.type}</span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: '#4a7a96',
                  }}
                >
                  {a.time}
                </span>
                <span style={{ fontSize: 12, color: '#e0f0fc' }}>
                  {a.affected.toLocaleString()}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {a.status === 'Active' && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: SEV_COLOR[a.severity],
                        animation: 'pulse 1.5s infinite',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      color: STATUS_COLOR[a.status] || '#4a7a96',
                    }}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alarm Detail Panel */}
        <div
          style={{
            background: '#071a28',
            border: '1px solid #0d2d42',
            borderRadius: 12,
            padding: 20,
            overflowY: 'auto',
          }}
        >
          {selected ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: SEV_COLOR[selected.severity],
                    boxShadow: `0 0 12px ${SEV_COLOR[selected.severity]}`,
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 13,
                    color: SEV_COLOR[selected.severity],
                  }}
                >
                  {selected.id}
                </span>
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#e0f0fc',
                  marginBottom: 4,
                }}
              >
                {selected.type}
              </div>
              <div style={{ fontSize: 13, color: '#4a7a96', marginBottom: 20 }}>
                {selected.node}
              </div>

              {[
                ['Severity', selected.severity],
                ['Location', selected.location],
                ['Service Affected', selected.service],
                ['Users Affected', selected.affected.toLocaleString()],
                ['Time', selected.time],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #0d2d42',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#2a5a72' }}>{k}</span>
                  <span
                    style={{ fontSize: 12, color: '#c8dde8', fontWeight: 500 }}
                  >
                    {v}
                  </span>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 20,
                }}
              >
                {selected.status === 'Active' && (
                  <button
                    onClick={() => ack(selected.id)}
                    style={{
                      background: '#1a3a00',
                      border: '1px solid #2a6a10',
                      color: '#7ddc4a',
                      padding: '10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    ✓ Acknowledge Alarm
                  </button>
                )}
                {selected.status !== 'Cleared' && (
                  <button
                    onClick={() => clear(selected.id)}
                    style={{
                      background: '#1a2a3a',
                      border: '1px solid #2a4a6a',
                      color: '#4fc3f7',
                      padding: '10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    ○ Clear Alarm
                  </button>
                )}
                <button
                  onClick={() => setShowTicketForm(true)}
                  style={{
                    background: '#2a1a3a',
                    border: '1px solid #5a2a8a',
                    color: '#c084fc',
                    padding: '10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  + Create Trouble Ticket
                </button>
              </div>

              {showTicketForm && (
                <div
                  style={{
                    marginTop: 16,
                    background: '#040d14',
                    borderRadius: 10,
                    padding: 16,
                    border: '1px solid #1a3a52',
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#e0f0fc',
                      marginBottom: 12,
                    }}
                  >
                    New Trouble Ticket
                  </div>
                  <input
                    value={newTicket.title}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, title: e.target.value })
                    }
                    placeholder="Ticket title..."
                    style={{
                      width: '100%',
                      background: '#071a28',
                      border: '1px solid #1a3a52',
                      color: '#c8dde8',
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      marginBottom: 8,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  />
                  <select
                    value={newTicket.priority}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, priority: e.target.value })
                    }
                    style={{
                      width: '100%',
                      background: '#071a28',
                      border: '1px solid #1a3a52',
                      color: '#c8dde8',
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      marginBottom: 8,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    {['P1', 'P2', 'P3', 'P4'].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#4a7a96',
                        marginBottom: 5,
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      Assign to Department
                    </div>
                    <select
                      value={newTicket.department}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          department: e.target.value,
                        })
                      }
                      style={{
                        width: '100%',
                        background: '#071a28',
                        border: '1px solid #1a3a52',
                        color: '#c8dde8',
                        padding: '8px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: "'Outfit',sans-serif",
                        cursor: 'pointer',
                      }}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={createTicket}
                      style={{
                        flex: 1,
                        background: '#0a3d5c',
                        border: '1px solid #1a6a9c',
                        color: '#4fc3f7',
                        padding: '8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowTicketForm(false)}
                      style={{
                        background: '#1a2a3a',
                        border: '1px solid #2a4a6a',
                        color: '#4a7a96',
                        padding: '8px 14px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#2a5a72',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 13 }}>
                Select an alarm to view details
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

function TroubleTickets({ tickets, setTickets }) {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Open', 'In Progress', 'Resolved'];

  const filtered =
    filter === 'All' ? tickets : tickets.filter((t) => t.status === filter);

  const updateStatus = (id, status) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  return (
    <div
      style={{
        padding: 24,
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#e0f0fc' }}>
            Trouble Tickets
          </div>
          <div style={{ fontSize: 13, color: '#3a6a88' }}>
            ITIL-aligned incident & problem management
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                background: filter === s ? '#0a3d5c' : '#071a28',
                border: `1px solid ${filter === s ? '#1a6a9c' : '#0d2d42'}`,
                color: filter === s ? '#4fc3f7' : '#4a7a96',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((t) => {
          const slaOk = t.slaRemaining > 60;
          return (
            <div
              key={t.id}
              style={{
                background: '#071a28',
                border: '1px solid #0d2d42',
                borderRadius: 12,
                padding: 20,
                borderLeft: `4px solid ${PRIO_COLOR[t.priority]}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 12,
                        color: '#4a7a96',
                      }}
                    >
                      {t.id}
                    </span>
                    <Badge label={t.priority} color={PRIO_COLOR[t.priority]} />
                    <Badge
                      label={t.status}
                      color={STATUS_COLOR[t.status] || '#4a7a96'}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#e0f0fc',
                      marginBottom: 4,
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 12, color: '#3a6a88' }}>
                      👤 {t.assignee}
                    </span>
                    <span style={{ fontSize: 12, color: '#3a6a88' }}>
                      📅 {t.created}
                    </span>
                    {t.alarmId && (
                      <span style={{ fontSize: 12, color: '#3a6a88' }}>
                        🔗 {t.alarmId}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{ fontSize: 11, color: '#2a5a72', marginBottom: 4 }}
                  >
                    SLA: {t.sla}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono',monospace",
                      color:
                        t.status === 'Resolved'
                          ? '#26de81'
                          : slaOk
                          ? '#4fc3f7'
                          : '#ff3b5c',
                    }}
                  >
                    {t.status === 'Resolved'
                      ? '✓ Done'
                      : `${Math.floor(t.slaRemaining / 60)}h ${
                          t.slaRemaining % 60
                        }m`}
                  </div>
                  {t.status !== 'Resolved' && (
                    <div
                      style={{
                        width: 100,
                        height: 4,
                        background: '#0d2d42',
                        borderRadius: 2,
                        marginTop: 6,
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          borderRadius: 2,
                          width: `${Math.min(
                            100,
                            (t.slaRemaining / (parseInt(t.sla) * 60)) * 100
                          )}%`,
                          background: slaOk ? '#26de81' : '#ff3b5c',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {t.status !== 'Resolved' && (
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: '1px solid #0d2d42',
                  }}
                >
                  {t.status === 'Open' && (
                    <button
                      onClick={() => updateStatus(t.id, 'In Progress')}
                      style={{
                        background: '#0a3d5c',
                        border: '1px solid #1a6a9c',
                        color: '#4fc3f7',
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      Start Work
                    </button>
                  )}
                  {t.status === 'In Progress' && (
                    <button
                      onClick={() => updateStatus(t.id, 'Resolved')}
                      style={{
                        background: '#0a2a1a',
                        border: '1px solid #1a6a3a',
                        color: '#26de81',
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(t.id, 'Open')}
                    style={{
                      background: '#071a28',
                      border: '1px solid #0d2d42',
                      color: '#4a7a96',
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    Reopen
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NetworkTopology({ alarms }) {
  const [hovered, setHovered] = useState(null);
  const nodeStatus = {};
  NETWORK_NODES.forEach((n) => {
    nodeStatus[n.id] = n.status;
  });

  const getColor = (status) =>
    status === 'fault' ? '#ff3b5c' : status === 'warn' ? '#f5c518' : '#26de81';
  const getLinkColor = (from, to) => {
    const nf = NETWORK_NODES.find((n) => n.id === from);
    const nt = NETWORK_NODES.find((n) => n.id === to);
    if (nf?.status === 'fault' || nt?.status === 'fault') return '#ff3b5c';
    if (nf?.status === 'warn' || nt?.status === 'warn') return '#f5c518';
    return '#1a4a6a';
  };

  const faultCount = NETWORK_NODES.filter((n) => n.status === 'fault').length;
  const warnCount = NETWORK_NODES.filter((n) => n.status === 'warn').length;

  return (
    <div
      style={{
        padding: 24,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#e0f0fc' }}>
            Network Topology
          </div>
          <div style={{ fontSize: 13, color: '#3a6a88' }}>
            Live network element status & fault propagation view
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            ['🔴', 'Fault', faultCount, '#ff3b5c'],
            ['🟡', 'Warning', warnCount, '#f5c518'],
            [
              '🟢',
              'Healthy',
              NETWORK_NODES.length - faultCount - warnCount,
              '#26de81',
            ],
          ].map(([e, l, c, col]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: col,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {c}
              </div>
              <div style={{ fontSize: 11, color: '#3a6a88' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: '#071a28',
          border: '1px solid #0d2d42',
          borderRadius: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 740 420"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#0d2d42"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="740" height="420" fill="url(#grid)" />

          {LINKS.map((l, i) => {
            const from = NETWORK_NODES.find((n) => n.id === l.from);
            const to = NETWORK_NODES.find((n) => n.id === l.to);
            const col = getLinkColor(l.from, l.to);
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={col}
                strokeWidth={col === '#ff3b5c' ? 2 : 1}
                strokeDasharray={col === '#ff3b5c' ? '6,3' : 'none'}
                opacity={0.6}
              />
            );
          })}

          {NETWORK_NODES.map((n) => {
            const col = getColor(n.status);
            const isHov = hovered === n.id;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                {n.status === 'fault' && (
                  <circle cx={n.x} cy={n.y} r={26} fill={col} opacity={0.1}>
                    <animate
                      attributeName="r"
                      values="20;30;20"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.15;0.05;0.15"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isHov ? 20 : 16}
                  fill="#071a28"
                  stroke={col}
                  strokeWidth={isHov ? 3 : 2}
                  style={{ transition: 'all 0.2s' }}
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fill={col}
                  fontSize="10"
                  fontWeight="700"
                >
                  {n.type === 'router'
                    ? 'R'
                    : n.type === 'gateway'
                    ? 'GW'
                    : n.type === 'switch'
                    ? 'SW'
                    : n.type === 'olt'
                    ? 'OL'
                    : 'MS'}
                </text>
                <text
                  x={n.x}
                  y={n.y + 30}
                  textAnchor="middle"
                  fill="#4a7a96"
                  fontSize="9"
                >
                  {n.label}
                </text>
                {isHov && (
                  <g>
                    <rect
                      x={n.x - 60}
                      y={n.y - 52}
                      width={120}
                      height={36}
                      fill="#040d14"
                      stroke={col}
                      strokeWidth="1"
                      rx="6"
                    />
                    <text
                      x={n.x}
                      y={n.y - 36}
                      textAnchor="middle"
                      fill="#e0f0fc"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {n.label}
                    </text>
                    <text
                      x={n.x}
                      y={n.y - 22}
                      textAnchor="middle"
                      fill={col}
                      fontSize="9"
                    >
                      {n.status.toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {[
            ['#ff3b5c', 'Fault / Link Down'],
            ['#f5c518', 'Warning / Degraded'],
            ['#26de81', 'Healthy'],
            ['#ff3b5c', 'Dashed = Fault Link'],
          ].map(([c, l]) => (
            <div
              key={l}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                color: '#4a7a96',
              }}
            >
              <div
                style={{ width: 16, height: 3, background: c, borderRadius: 2 }}
              />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BillingManagement({ customers, setCustomers, invoices, setInvoices }) {
  const [tab, setTab] = useState('invoices');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    plan: 'Business Standard',
    amount: '',
  });

  const addCustomer = () => {
    if (!form.name || !form.amount) return;
    const c = {
      id: `CUST-00${customers.length + 1}`,
      name: form.name,
      plan: form.plan,
      status: 'Active',
      balance: parseInt(form.amount),
      due: '2024-04-15',
      invoices: 0,
      lastPayment: '—',
      usage: 0,
    };
    setCustomers((prev) => [...prev, c]);
    const inv = {
      id: `INV-${9842 + invoices.length}`,
      customer: form.name,
      amount: parseInt(form.amount),
      status: 'Pending',
      due: '2024-04-15',
      period: 'Mar 2024',
      services: ['Internet'],
    };
    setInvoices((prev) => [inv, ...prev]);
    setShowAdd(false);
    setForm({ name: '', plan: 'Business Standard', amount: '' });
  };

  const markPaid = (id) =>
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Paid' } : i))
    );
  const suspend = (id) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Suspended' } : c))
    );
  const activate = (id) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Active' } : c))
    );

  const totalRevenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices
    .filter((i) => i.status === 'Pending')
    .reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'Overdue')
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div
      style={{
        padding: 24,
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#e0f0fc' }}>
            Billing Management
          </div>
          <div style={{ fontSize: 13, color: '#3a6a88' }}>
            Customer accounts, invoicing & payment management
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: '#0a3d5c',
            border: '1px solid #1a6a9c',
            color: '#4fc3f7',
            padding: '8px 18px',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: "'Outfit',sans-serif",
            fontWeight: 600,
          }}
        >
          + Add Customer
        </button>
      </div>

      {/* Revenue KPIs */}
      <div style={{ display: 'flex', gap: 12 }}>
        <KpiCard
          label="Revenue Collected"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          color="#26de81"
          icon="✅"
        />
        <KpiCard
          label="Pending Collection"
          value={`₹${(totalPending / 100000).toFixed(1)}L`}
          color="#f5c518"
          icon="⏳"
        />
        <KpiCard
          label="Overdue Amount"
          value={`₹${(totalOverdue / 1000).toFixed(0)}K`}
          color="#ff3b5c"
          icon="🚨"
        />
        <KpiCard
          label="Total Accounts"
          value={customers.length}
          color="#00c8ff"
          icon="👥"
        />
      </div>

      {/* Tabs */}
      <div
        style={{ display: 'flex', gap: 0, borderBottom: '1px solid #0d2d42' }}
      >
        {['invoices', 'customers'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit',sans-serif",
              textTransform: 'capitalize',
              color: tab === t ? '#4fc3f7' : '#3a6a88',
              borderBottom:
                tab === t ? '2px solid #4fc3f7' : '2px solid transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'invoices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                background: '#071a28',
                border: '1px solid #0d2d42',
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  color: '#4a7a96',
                  width: 80,
                }}
              >
                {inv.id}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: '#e0f0fc' }}
                >
                  {inv.customer}
                </div>
                <div style={{ fontSize: 11, color: '#3a6a88' }}>
                  {inv.period} · {inv.services.join(', ')}
                </div>
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace",
                  color: '#e0f0fc',
                }}
              >
                ₹{inv.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#3a6a88' }}>
                Due: {inv.due}
              </div>
              <Badge label={inv.status} color={INV_COLOR[inv.status]} />
              {inv.status !== 'Paid' && (
                <button
                  onClick={() => markPaid(inv.id)}
                  style={{
                    background: '#0a2a1a',
                    border: '1px solid #1a6a3a',
                    color: '#26de81',
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Mark Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'customers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {customers.map((c) => (
            <div
              key={c.id}
              style={{
                background: '#071a28',
                border: '1px solid #0d2d42',
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: '#4a7a96',
                  width: 70,
                }}
              >
                {c.id}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: '#e0f0fc' }}
                >
                  {c.name}
                </div>
                <div style={{ fontSize: 11, color: '#3a6a88' }}>
                  {c.plan} · Last paid: {c.lastPayment}
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 12, color: '#3a6a88', marginBottom: 4 }}
                >
                  Usage
                </div>
                <div
                  style={{
                    width: 80,
                    height: 4,
                    background: '#0d2d42',
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      width: `${c.usage}%`,
                      background: c.usage > 80 ? '#ff8c00' : '#26de81',
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: '#e0f0fc',
                  }}
                >
                  ₹{c.balance.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: '#3a6a88' }}>
                  Due: {c.due}
                </div>
              </div>
              <Badge
                label={c.status}
                color={
                  c.status === 'Active'
                    ? '#26de81'
                    : c.status === 'Suspended'
                    ? '#ff3b5c'
                    : '#f5c518'
                }
              />
              {c.status === 'Active' ? (
                <button
                  onClick={() => suspend(c.id)}
                  style={{
                    background: '#2a1a1a',
                    border: '1px solid #6a2a2a',
                    color: '#ff3b5c',
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => activate(c.id)}
                  style={{
                    background: '#0a2a1a',
                    border: '1px solid #1a6a3a',
                    color: '#26de81',
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Activate
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      {showAdd && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#071a28',
              border: '1px solid #1a3a52',
              borderRadius: 16,
              padding: 32,
              width: 420,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#e0f0fc',
                marginBottom: 20,
              }}
            >
              Add New Customer
            </div>
            {[
              ['Company Name', 'text', 'name', 'Acme Corp'],
              ['Monthly Amount (₹)', 'number', 'amount', '50000'],
            ].map(([l, t, k, ph]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div
                  style={{ fontSize: 12, color: '#4a7a96', marginBottom: 6 }}
                >
                  {l}
                </div>
                <input
                  type={t}
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  placeholder={ph}
                  style={{
                    width: '100%',
                    background: '#040d14',
                    border: '1px solid #1a3a52',
                    color: '#c8dde8',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#4a7a96', marginBottom: 6 }}>
                Plan
              </div>
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                style={{
                  width: '100%',
                  background: '#040d14',
                  border: '1px solid #1a3a52',
                  color: '#c8dde8',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {['Business Standard', 'Business Pro', 'Enterprise Plus'].map(
                  (p) => (
                    <option key={p}>{p}</option>
                  )
                )}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={addCustomer}
                style={{
                  flex: 1,
                  background: '#0a3d5c',
                  border: '1px solid #1a6a9c',
                  color: '#4fc3f7',
                  padding: '10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 600,
                }}
              >
                Create Account
              </button>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  background: '#1a2a3a',
                  border: '1px solid #2a4a6a',
                  color: '#4a7a96',
                  padding: '10px 18px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PerformanceManagement() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const rand = (base, range) =>
    base +
    Math.sin(tick * 0.7 + base) * range +
    (Math.random() - 0.5) * range * 0.3;

  const kpis = [
    {
      name: 'Mumbai Core',
      latency: rand(8, 3).toFixed(1),
      loss: rand(0.2, 0.15).toFixed(2),
      uptime: '99.98%',
      bw: rand(72, 15).toFixed(0),
      status: 'ok',
    },
    {
      name: 'Delhi POP',
      latency: rand(12, 4).toFixed(1),
      loss: rand(0.1, 0.08).toFixed(2),
      uptime: '99.95%',
      bw: rand(58, 20).toFixed(0),
      status: 'ok',
    },
    {
      name: 'Chennai BTS',
      latency: rand(25, 8).toFixed(1),
      loss: rand(1.2, 0.8).toFixed(2),
      uptime: '98.20%',
      bw: rand(45, 25).toFixed(0),
      status: 'warn',
    },
    {
      name: 'Hyderabad DC',
      latency: rand(999, 1).toFixed(0),
      loss: rand(100, 0).toFixed(0),
      uptime: '—',
      bw: '0',
      status: 'fault',
    },
    {
      name: 'Bengaluru Core',
      latency: rand(6, 2).toFixed(1),
      loss: rand(0.05, 0.03).toFixed(2),
      uptime: '99.99%',
      bw: rand(88, 10).toFixed(0),
      status: 'ok',
    },
    {
      name: 'Pune Hub',
      latency: rand(18, 5).toFixed(1),
      loss: rand(0.5, 0.3).toFixed(2),
      uptime: '99.60%',
      bw: rand(35, 10).toFixed(0),
      status: 'warn',
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#e0f0fc' }}>
          Performance Management
        </div>
        <div style={{ fontSize: 13, color: '#3a6a88' }}>
          Live KPI monitoring — updates every 2 seconds
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 12,
        }}
      >
        {kpis.map((k) => {
          const col =
            k.status === 'fault'
              ? '#ff3b5c'
              : k.status === 'warn'
              ? '#f5c518'
              : '#26de81';
          return (
            <div
              key={k.name}
              style={{
                background: '#071a28',
                border: `1px solid ${col}33`,
                borderRadius: 12,
                padding: 20,
                borderTop: `2px solid ${col}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: col,
                    boxShadow: k.status !== 'ok' ? `0 0 8px ${col}` : 'none',
                    animation:
                      k.status === 'fault' ? 'pulse 1s infinite' : 'none',
                  }}
                />
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: '#e0f0fc' }}
                >
                  {k.name}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                {[
                  [
                    'Latency',
                    k.status === 'fault' ? '∞' : k.latency + 'ms',
                    k.latency > 20 ? '#ff8c00' : '#26de81',
                  ],
                  [
                    'Packet Loss',
                    k.status === 'fault' ? '100%' : k.loss + '%',
                    parseFloat(k.loss) > 0.5 ? '#ff3b5c' : '#26de81',
                  ],
                  [
                    'Uptime',
                    k.uptime,
                    k.uptime === '—' ? '#ff3b5c' : '#26de81',
                  ],
                  [
                    'BW Usage',
                    k.bw + '%',
                    parseInt(k.bw) > 80 ? '#ff8c00' : '#4fc3f7',
                  ],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      background: '#040d14',
                      borderRadius: 8,
                      padding: '10px 12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#2a5a72',
                        marginBottom: 4,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: c,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: '#071a28',
          border: '1px solid #0d2d42',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#e0f0fc',
            marginBottom: 16,
          }}
        >
          Network Throughput Trend (Simulated Live)
        </div>
        <svg width="100%" height="80" viewBox="0 0 600 80">
          {Array.from({ length: 30 }, (_, i) => {
            const y =
              40 +
              Math.sin((i + tick) * 0.4) * 20 +
              Math.sin((i + tick) * 0.9) * 8;
            return i === 0 ? `M ${i * 20},${y}` : ` L ${i * 20},${y}`;
          }).join('')}
          <path
            d={Array.from({ length: 30 }, (_, i) => {
              const y =
                40 +
                Math.sin((i + tick) * 0.4) * 20 +
                Math.sin((i + tick) * 0.9) * 8;
              return i === 0 ? `M ${i * 20},${y}` : `L ${i * 20},${y}`;
            }).join('')}
            fill="none"
            stroke="#4fc3f7"
            strokeWidth="2"
          />
          <path
            d={Array.from({ length: 30 }, (_, i) => {
              const y =
                55 +
                Math.sin((i + tick) * 0.6 + 2) * 12 +
                Math.sin((i + tick) * 1.1) * 5;
              return i === 0 ? `M ${i * 20},${y}` : `L ${i * 20},${y}`;
            }).join('')}
            fill="none"
            stroke="#26de81"
            strokeWidth="2"
          />
          <path
            d={Array.from({ length: 30 }, (_, i) => {
              const y = 30 + Math.sin((i + tick) * 0.3 + 1) * 15;
              return i === 0 ? `M ${i * 20},${y}` : `L ${i * 20},${y}`;
            }).join('')}
            fill="none"
            stroke="#f5c518"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
        </svg>
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          {[
            ['#4fc3f7', 'Uplink'],
            ['#26de81', 'Downlink'],
            ['#f5c518', 'Threshold'],
          ].map(([c, l]) => (
            <div
              key={l}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: '#4a7a96',
              }}
            >
              <div
                style={{ width: 20, height: 2, background: c, borderRadius: 1 }}
              />
              {l}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', icon: '⬛', label: 'Dashboard' },
  { id: 'fault', icon: '🚨', label: 'Fault Mgmt' },
  { id: 'tickets', icon: '🎫', label: 'Trouble Tickets' },
  { id: 'topology', icon: '🗺️', label: 'Network Topology' },
  { id: 'performance', icon: '📊', label: 'Performance' },
  { id: 'billing', icon: '💳', label: 'Billing Mgmt' },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [alarms, setAlarms] = useState(INITIAL_ALARMS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate occasional new alarm
  useEffect(() => {
    const t = setInterval(() => {
      const sevs = ['Warning', 'Minor', 'Major'];
      const types = [
        'High Memory',
        'Interface Down',
        'Packet Loss',
        'Power Fluctuation',
      ];
      const nodes = [
        'BTS-Kolkata-12',
        'Switch-Ahm-03',
        'Router-Jaipur-01',
        'OLT-Surat-07',
      ];
      const newAlarm = {
        id: `ALM${Math.floor(Math.random() * 900 + 100)}`,
        severity: sevs[Math.floor(Math.random() * sevs.length)],
        node: nodes[Math.floor(Math.random() * nodes.length)],
        type: types[Math.floor(Math.random() * types.length)],
        location: 'Auto-detected',
        time: new Date().toLocaleTimeString(),
        status: 'Active',
        service: 'Various',
        affected: Math.floor(Math.random() * 500 + 10),
      };
      setAlarms((prev) => [newAlarm, ...prev].slice(0, 20));
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const activeAlarms = alarms.filter((a) => a.status === 'Active').length;
  const critAlarms = alarms.filter(
    (a) => a.severity === 'Critical' && a.status === 'Active'
  ).length;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#040d14',
        overflow: 'hidden',
      }}
    >
      <style>{css}</style>

      {/* Sidebar */}
      <div
        style={{
          width: 220,
          background: '#040d14',
          borderRight: '1px solid #0d2d42',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid #0d2d42',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono',monospace",
              color: '#4fc3f7',
              letterSpacing: '0.2em',
            }}
          >
            ◈ OSS/BSS
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#e0f0fc',
              marginTop: 2,
            }}
          >
            NetOps Pro
          </div>
          <div style={{ fontSize: 10, color: '#2a5a72', marginTop: 2 }}>
            v2.4.1 · TM Forum Aligned
          </div>
        </div>

        {/* Live Status */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #0d2d42',
            background: '#071220',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#26de81',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontFamily: "'JetBrains Mono',monospace",
                color: '#26de81',
              }}
            >
              LIVE
            </span>
            <span
              style={{
                fontSize: 10,
                color: '#2a5a72',
                marginLeft: 'auto',
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {liveTime.toLocaleTimeString()}
            </span>
          </div>
          {critAlarms > 0 && (
            <div
              style={{
                background: 'rgba(255,59,92,0.1)',
                border: '1px solid rgba(255,59,92,0.3)',
                borderRadius: 6,
                padding: '6px 10px',
                marginTop: 6,
              }}
            >
              <div style={{ fontSize: 11, color: '#ff3b5c', fontWeight: 600 }}>
                🚨 {critAlarms} Critical Alarm{critAlarms > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                textAlign: 'left',
                background: view === n.id ? '#0a3d5c' : 'transparent',
                color: view === n.id ? '#4fc3f7' : '#4a7a96',
                fontFamily: "'Outfit',sans-serif",
                fontSize: 13,
                fontWeight: view === n.id ? 600 : 400,
                borderLeft:
                  view === n.id ? '2px solid #4fc3f7' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === 'fault' && activeAlarms > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: '#ff3b5c',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {activeAlarms}
                </span>
              )}
              {n.id === 'tickets' &&
                tickets.filter((t) => t.status !== 'Resolved').length > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      background: '#ff8c00',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 10,
                      padding: '1px 7px',
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    {tickets.filter((t) => t.status !== 'Resolved').length}
                  </span>
                )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #0d2d42' }}>
          <div
            style={{
              fontSize: 10,
              color: '#1a3a52',
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            TMF620 · TMF621 · TMF642
            <br />
            ITU-T X.733 · ITIL v4
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {view === 'dashboard' && (
          <Dashboard
            alarms={alarms}
            tickets={tickets}
            customers={customers}
            invoices={invoices}
          />
        )}
        {view === 'fault' && (
          <FaultManagement
            alarms={alarms}
            setAlarms={setAlarms}
            tickets={tickets}
            setTickets={setTickets}
          />
        )}
        {view === 'tickets' && (
          <TroubleTickets tickets={tickets} setTickets={setTickets} />
        )}
        {view === 'topology' && <NetworkTopology alarms={alarms} />}
        {view === 'performance' && <PerformanceManagement />}
        {view === 'billing' && (
          <BillingManagement
            customers={customers}
            setCustomers={setCustomers}
            invoices={invoices}
            setInvoices={setInvoices}
          />
        )}
      </div>
    </div>
  );
}
