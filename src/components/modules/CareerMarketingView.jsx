/**
 * Career Marketing View
 *
 * Dedicated section for Candidate Marketing deliverables:
 * Résumé review & optimization, LinkedIn profile enhancement, personal branding,
 * and warm networking contact management.
 *
 * Used By:
 * Main App navigation ('marketing').
 */
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import {
  Sparkles,
  FileText,
  Linkedin,
  Users,
  CheckCircle2,
  Download,
  ExternalLink,
  Plus,
  Mail,
} from 'lucide-react';

export default function CareerMarketingView({ onNavigateToPlan }) {
  const [contacts, setContacts] = useState([
    {
      id: 'net-1',
      name: 'Dr. Sarah Lin',
      role: 'Director of Clinical Analytics, Northwestern Medicine',
      status: 'Connected',
      lastContact: '2026-09-18',
      nextAction: 'Follow up on Informatics team opening',
    },
    {
      id: 'net-2',
      name: 'Michael Chang',
      role: 'Principal Recruiter, Rush Health Systems',
      status: 'In Conversation',
      lastContact: '2026-09-15',
      nextAction: 'Send updated healthcare case study',
    },
    {
      id: 'net-3',
      name: 'Rachel Adams',
      role: 'VP of Data Strategy, Advocate Health',
      status: 'Outreach Sent',
      lastContact: '2026-09-20',
      nextAction: 'Check in if no reply by Sep 27',
    },
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName) return;
    setContacts([
      ...contacts,
      {
        id: `net-${Date.now()}`,
        name: newContactName,
        role: newContactRole || 'Healthcare Industry Contact',
        status: 'Outreach Sent',
        lastContact: new Date().toISOString().split('T')[0],
        nextAction: 'Initial connection follow-up',
      },
    ]);
    setNewContactName('');
    setNewContactRole('');
    setShowAddContact(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Career Marketing & Inbound Positioning</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Optimize your candidate collateral to convert recruiter outreach into high-yield interviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200">
            Market Positioning: <strong>Verified by Priya Nair</strong>
          </span>
        </div>
      </div>

      {/* 3 Core Marketing Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Résumé Optimization */}
        <Card
          title="Résumé Optimization"
          subtitle="ATS Alignment & Metric Verification"
          action={<StatusBadge status="Completed" />}
        >
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">ATS Match Score:</span>
              <strong className="text-base text-emerald-600 font-bold">94/100</strong>
            </div>
            <ProgressBar value={94} height="h-2" showPercentage={false} />
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                Active Version: Healthcare_Analytics_v3.2.pdf
              </div>
              <p className="text-neutral-500 text-[11px]">
                Quantified metrics added for EHR SQL pipeline efficiency (+34%) and claims validation turnaround.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={Download}
              onClick={() => alert('Downloading verified ATS resume package...')}
            >
              Download Verified Résumé
            </Button>
          </div>
        </Card>

        {/* LinkedIn Optimization */}
        <Card
          title="LinkedIn Profile"
          subtitle="Algorithmic Search Positioning"
          action={<StatusBadge status="Completed" />}
        >
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Recruiter Search Index:</span>
              <strong className="text-base text-[#EAB308] font-bold">Top 8%</strong>
            </div>
            <ProgressBar value={92} height="h-2" showPercentage={false} />
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-sky-600" />
                <span>Headline & Featured Sections Synced</span>
              </div>
              <p className="text-neutral-500 text-[11px]">
                Keywords targeted: Healthcare Informatics, Claims EDI 837/835, SQL, Tableau, HIPAA.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={ExternalLink}
              onClick={() => window.open('https://linkedin.com', '_blank')}
            >
              View Linked Profile
            </Button>
          </div>
        </Card>

        {/* Personal Brand & Narrative */}
        <Card
          title="Personal Narrative"
          subtitle="Executive Pitch & Portfolio"
          action={<StatusBadge status="In Progress" />}
        >
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Narrative Completeness:</span>
              <strong className="text-base text-amber-600 font-bold">80%</strong>
            </div>
            <ProgressBar value={80} height="h-2" showPercentage={false} />
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                Core Value Proposition:
              </div>
              <p className="text-neutral-500 text-[11px]">
                "Translating complex clinical EHR data into measurable cost-containment and superior patient outcomes."
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => alert('Opening Personal Brand Narrative Guide...')}
            >
              Edit Elevator Pitch
            </Button>
          </div>
        </Card>
      </div>

      {/* Networking Contacts Tracker */}
      <Card
        title="Active Industry Networking Pipeline"
        subtitle="Track targeted conversations, referrals, and recruiter interactions."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddContact(true)}
          >
            Add Contact
          </Button>
        }
      >
        {showAddContact && (
          <form
            onSubmit={handleAddContact}
            className="mb-4 p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3"
          >
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              New Industry Networking Contact
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Contact Name (e.g. Dr. Emily Watson)"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100"
              />
              <input
                type="text"
                placeholder="Role & Organization (e.g. Clinical Analytics Lead, Rush)"
                value={newContactRole}
                onChange={(e) => setNewContactRole(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddContact(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Contact
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                    {contact.name}
                  </span>
                  <StatusBadge status={contact.status} />
                </div>
                <div className="text-neutral-600 dark:text-neutral-400 font-medium">
                  {contact.role}
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Next Step: {contact.nextAction}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-neutral-500 text-[11px]">
                <span>Last Contact: {contact.lastContact}</span>
                <button
                  onClick={() => alert(`Emailing follow-up template for ${contact.name}...`)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                  title="Send Follow-up Note"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
