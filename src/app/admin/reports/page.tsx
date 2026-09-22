'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Printer, FileText, Users, BookOpen, DollarSign, Calendar } from 'lucide-react';

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExportCSV = async (type: string) => {
    setDownloading(type + '_csv');
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';

      if (type === 'volunteer') {
        csvContent += 'Volunteer ID,Full Name,City,Language,Approval Status,Books Received,Books Sold,Books Returned,Total Sales (INR)\n';
        csvContent += 'VOL1001,Ravi Kumar,Hyderabad,Telugu,APPROVED,100,65,15,12400\n';
        csvContent += 'VOL1002,Priya Sharma,Bangalore,Kannada,APPROVED,50,30,0,6000\n';
        csvContent += 'VOL1003,Amit Patel,Mumbai,Hindi,PENDING,0,0,0,0\n';
      } else if (type === 'book') {
        csvContent += 'Book ID,Book Name,Category,Languages Count,Total Stock,Allocated,Sold,Returned,Available Stock\n';
        csvContent += 'BK-BG-001,Bhagavad-gita As It Is,Bhagavad Gita,6,1200,350,220,15,615\n';
        csvContent += 'BK-SB-001,Srimad-Bhagavatam (Canto 1),Srimad Bhagavatam,3,500,120,80,5,295\n';
      } else if (type === 'financial') {
        csvContent += 'Campaign ID,Campaign Name,Total Revenue (INR),Collected (INR),Settled (INR),Pending Settlement (INR)\n';
        csvContent += 'CAMP-2026-MARATHON,Annual Prabhupada Book Marathon 2026,18400,18400,10000,8400\n';
      } else if (type === 'campaign') {
        csvContent += 'Campaign ID,Campaign Name,Start Date,End Date,Total Volunteers,Distributed Books,Revenue (INR)\n';
        csvContent += 'CAMP-2026-MARATHON,Annual Prabhupada Book Marathon 2026,2026-10-01,2026-12-31,3,150,18400\n';
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `iskcon_${type}_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  const handleExportExcel = async (type: string) => {
    setDownloading(type + '_excel');
    try {
      // Create XML-formatted Excel spreadsheet Blob
      const excelHeader = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
      let xmlContent = `${excelHeader}<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="ISKCON Report"><Table>`;

      if (type === 'volunteer') {
        xmlContent += '<Row><Cell><Data ss:Type="String">Volunteer ID</Data></Cell><Cell><Data ss:Type="String">Full Name</Data></Cell><Cell><Data ss:Type="String">City</Data></Cell><Cell><Data ss:Type="String">Books Sold</Data></Cell><Cell><Data ss:Type="String">Total Sales (₹)</Data></Cell></Row>';
        xmlContent += '<Row><Cell><Data ss:Type="String">VOL1001</Data></Cell><Cell><Data ss:Type="String">Ravi Kumar</Data></Cell><Cell><Data ss:Type="String">Hyderabad</Data></Cell><Cell><Data ss:Type="Number">65</Data></Cell><Cell><Data ss:Type="Number">12400</Data></Cell></Row>';
        xmlContent += '<Row><Cell><Data ss:Type="String">VOL1002</Data></Cell><Cell><Data ss:Type="String">Priya Sharma</Data></Cell><Cell><Data ss:Type="String">Bangalore</Data></Cell><Cell><Data ss:Type="Number">30</Data></Cell><Cell><Data ss:Type="Number">6000</Data></Cell></Row>';
      } else {
        xmlContent += '<Row><Cell><Data ss:Type="String">Report Item</Data></Cell><Cell><Data ss:Type="String">Metric Value</Data></Cell></Row>';
        xmlContent += `<Row><Cell><Data ss:Type="String">ISKCON ${type} report</Data></Cell><Cell><Data ss:Type="String">Generated 2026</Data></Cell></Row>`;
      }

      xmlContent += '</Table></Worksheet></Workbook>';

      const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iskcon_${type}_report_${Date.now()}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  const handleExportPDF = (type: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ISKCON ${type.toUpperCase()} Official Report</title>
            <style>
              body { font-family: serif; padding: 40px; color: #451a03; }
              .header { text-align: center; border-bottom: 3px solid #d97706; padding-bottom: 15px; margin-bottom: 25px; }
              h1 { color: #7c2d12; margin: 0; font-size: 24px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif; font-size: 12px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #fffbe1; color: #78350f; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>International Society for Krishna Consciousness</h1>
              <p>Official ${type.toUpperCase()} Distribution & Audit Report</p>
            </div>
            <table>
              <thead>
                <tr><th>ID / Reference</th><th>Entity Description</th><th>Quantity / Metric</th><th>Financial Status</th></tr>
              </thead>
              <tbody>
                <tr><td>CAMP-2026</td><td>Annual Prabhupada Book Marathon 2026</td><td>150 Books Distributed</td><td>₹18,400 Total Sales</td></tr>
                <tr><td>VOL1001</td><td>Ravi Kumar (Hyderabad)</td><td>65 Books Sold</td><td>₹12,400 Collected</td></tr>
                <tr><td>VOL1002</td><td>Priya Sharma (Bangalore)</td><td>30 Books Sold</td><td>₹6,000 Collected</td></tr>
              </tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Multiformat Report Generation
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Reports & Analytics Module</h1>
          <p className="text-xs text-gray-500">Generate and export official temple distribution reports in Excel (.xls), CSV, and PDF formats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'volunteer', title: 'Volunteer Performance Report', desc: 'Detailed metrics for volunteer allocations, sales, returns, and settlement statuses.', icon: Users },
          { key: 'book', title: 'Book & Language Stock Report', desc: 'Stock breakdown by book title, language edition, total stock, and available inventory.', icon: BookOpen },
          { key: 'financial', title: 'Financial Audit Ledger', desc: 'Financial audit breakdown of gross revenue, cash collections, online QR receipts, and pending settlements.', icon: DollarSign },
          { key: 'campaign', title: 'Campaign Summary Report', desc: 'Overall marathon campaign performance, registration totals, and overall inventory metrics.', icon: Calendar },
        ].map((rep) => {
          const Icon = rep.icon;
          return (
            <div key={rep.key} className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-saffron-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-maroon-900">{rep.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{rep.desc}</p>
              </div>

              {/* 3 Formats Export Buttons: Excel, CSV, PDF */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-xs">
                <button
                  onClick={() => handleExportExcel(rep.key)}
                  className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center space-x-1"
                  title="Export to Excel Spreadsheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={() => handleExportCSV(rep.key)}
                  className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center justify-center space-x-1"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-saffron-700" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={() => handleExportPDF(rep.key)}
                  className="py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold flex items-center justify-center space-x-1"
                  title="Print / PDF Export"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
