import { jsPDF } from 'jspdf';

/**
 * Exports social media content calendar to CSV
 */
export const exportToCSV = (posts, calendarTitle = 'Content_Calendar') => {
  if (!posts || posts.length === 0) return;

  const headers = ['Date', 'Time Slot', 'Platform', 'Post Type', 'Title', 'Caption', 'Hashtags', 'Status', 'Engagement Tip'];

  const rows = posts.map((post) => [
    post.date || '',
    post.timeSlot || '',
    post.platform || '',
    post.postType || '',
    `"${(post.title || '').replace(/"/g, '""')}"`,
    `"${(post.caption || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(Array.isArray(post.hashtags) ? post.hashtags.join(' ') : post.hashtags || '').replace(/"/g, '""')}"`,
    post.status || 'draft',
    `"${(post.engagementTip || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${calendarTitle.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports social media content calendar to JSON
 */
export const exportToJSON = (posts, calendarInfo = {}) => {
  if (!posts || posts.length === 0) return;

  const exportData = {
    exportedAt: new Date().toISOString(),
    calendar: calendarInfo,
    totalPosts: posts.length,
    posts: posts.map((post) => ({
      id: post._id,
      date: post.date,
      timeSlot: post.timeSlot,
      platform: post.platform,
      postType: post.postType,
      title: post.title,
      caption: post.caption,
      hashtags: post.hashtags,
      imagePrompt: post.imagePrompt,
      engagementTip: post.engagementTip,
      status: post.status,
    })),
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${(calendarInfo.topic || 'Content_Calendar').replace(/\s+/g, '_')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Exports social media content calendar to high-quality PDF
 */
export const exportToPDF = (posts, calendarInfo = {}) => {
  if (!posts || posts.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const calendarTitle = calendarInfo.topic || 'Social Media Content Calendar';
  const month = calendarInfo.month || '30-Day Plan';

  // Header styling
  doc.setFillColor(79, 70, 229); // #4f46e5 Indigo
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PostWise-AI | Content Calendar Roadmap', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${month} • ${posts.length} Posts`, 160, 15);

  // Subheader
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(calendarTitle, 14, 33);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleDateString()} for Instagram, LinkedIn & X`, 14, 38);

  let y = 44;
  const pageHeight = 285;

  posts.forEach((post, index) => {
    // Check if new page needed
    if (y > pageHeight - 32) {
      doc.addPage();
      y = 18;
    }

    // Post Card Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 26, 2, 2, 'FD');

    // Platform Tag Color
    if (post.platform === 'Instagram') {
      doc.setFillColor(225, 48, 108); // Pink
    } else if (post.platform === 'LinkedIn') {
      doc.setFillColor(10, 102, 194); // Blue
    } else {
      doc.setFillColor(15, 20, 25); // Dark
    }
    doc.rect(14, y, 3, 26, 'F');

    // Date & Time
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`${post.date || ''} • ${post.timeSlot || ''} [${post.platform}]`, 20, y + 6);

    // Status Pill
    const statusText = (post.status || 'draft').toUpperCase();
    doc.setFontSize(7);
    doc.setTextColor(99, 102, 241);
    doc.text(`STATUS: ${statusText}`, 160, y + 6);

    // Title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const splitTitle = doc.splitTextToSize(post.title || '', 170);
    doc.text(splitTitle[0] || '', 20, y + 12);

    // Caption snippet
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const cleanCaption = (post.caption || '').replace(/\n+/g, ' ');
    const splitCaption = doc.splitTextToSize(cleanCaption, 172);
    doc.text(splitCaption[0] || '', 20, y + 18);

    // Hashtags snippet
    if (post.hashtags && post.hashtags.length > 0) {
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const tags = Array.isArray(post.hashtags) ? post.hashtags.join(' ') : post.hashtags;
      doc.text(tags.substring(0, 100), 20, y + 23);
    }

    y += 29;
  });

  doc.save(`${(calendarTitle || 'Content_Calendar').replace(/\s+/g, '_')}.pdf`);
};
