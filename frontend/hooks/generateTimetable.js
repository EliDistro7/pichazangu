import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateTimetable(events, viewType, dateRange) {
    const doc = new jsPDF();
    const normalPurple = [128, 0, 128]; // Normal purple color

    // Parse the date range
    const [startRange, endRange] = dateRange.split(' - ').map(dateStr => new Date(dateStr));

    // Determine the interval type (day, week, month)
    const dateDifference = (endRange - startRange) / (1000 * 60 * 60 * 24); // Difference in days
    let headerTitle = 'Ratiba ya Vipindi Mbali Mbali Kanisani'; // Default subtitle
    if (dateDifference === 0) {
        headerTitle = 'Ratiba ya Siku';
    } else if (dateDifference <= 7) {
        headerTitle = 'Ratiba ya Wiki';
    } else {
        headerTitle = 'Ratiba ya Mwezi';
    }

    // Helper function to format the date without the day of the week
    const formatDateWithoutWeekday = (date) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('sw-TZ', options); // This removes the weekday
    };

    // Use this function to format both the start and end date range
    const formattedDateRange = `${formatDateWithoutWeekday(startRange)} - ${formatDateWithoutWeekday(endRange)}`;

    // Filter events based on the viewType and dateRange
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.start.split('T')[0]); // Parse event start date
        return eventDate >= startRange && eventDate <= endRange;
    });

    // Header - Soft Purple Background for Title, Subtitle, and Date Range
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerHeight = 40; // Increased header height to fit all header info

    // Set the purple background for the entire header section
    doc.setFillColor(204, 153, 255); // Lighter purple for header
    doc.rect(0, 0, pageWidth, headerHeight, 'F'); // Full width light purple header background

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...normalPurple); // Purple text color
    doc.text('KKKT Usharika wa Yombo', pageWidth / 2, 10, { align: 'center' });

    // Subtitle and Date Range
    doc.setFontSize(12);
    doc.text(headerTitle, pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Muda wa Ratiba: ${formattedDateRange}`, pageWidth / 2, 26, { align: 'center' });

    // Table Data
    const tableData = filteredEvents.map((event) => [
        event.start.split('T')[0], // Date (YYYY-MM-DD)
        event.start.split('T')[1].slice(0, 5), // Start Time (HH:MM)
        event.end.split('T')[1].slice(0, 5), // End Time (HH:MM)
        event.title, // Event Title
        event.group || 'N/A', // Group/Ministry (default to "N/A" if not provided)
    ]);

    // Add Table with customized styling
    doc.autoTable({
        startY: headerHeight + 5, // Start below the title and the purple header
        head: [['Tarehe', 'Kuanza', 'Kumaliza', 'Kipindi', 'Kikundi']],
        body: tableData,
        styles: {
            fillColor: [255, 255, 255], // White background for table rows
            textColor: [0, 0, 0], // Black text for table rows
            fontSize: 10, // Smaller font for a cleaner look
            lineWidth: 0.1, // Lighter borders for a modern look
            lineColor: [200, 200, 200], // Soft gray borders
            cellPadding: 4, // Spacing between text and cell borders
        },
        headStyles: {
            fillColor: normalPurple,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 11, // Slightly larger for header text
        },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Auto width for date column
            1: { cellWidth: 30 }, // Fixed width for start time
            2: { cellWidth: 30 }, // Fixed width for end time
            3: { cellWidth: 50 }, // Fixed width for event title
            4: { cellWidth: 50 }, // Fixed width for group
        },
    });

    // Add bottom purple footer with reduced height
    const footerHeight = 8; // Set footer height
    doc.setFillColor(...normalPurple);
    doc.rect(0, doc.internal.pageSize.getHeight() - footerHeight, pageWidth, footerHeight, 'F'); // Purple footer

    // Footer text
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255); // White text for footer
        doc.text('Imetengenezwa na KKKT Yombo system', pageWidth / 2, doc.internal.pageSize.getHeight() - footerHeight + 4, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - footerHeight + 4, { align: 'right' });
    }

    // Save the PDF
    doc.save('KKKT_Usharika_wa_Yombo_Timetable.pdf');
}
