import { jsPDF as JsPDF } from 'jspdf';
import type { IMessageProcessed } from '@/components/atoms/message/message-component';

interface ArticleReferencesProps {
    messages: IMessageProcessed[];
    references: string[];
    articleName: string;
}

export function ArticleReferences({
    messages,
    references,
    articleName,
}: ArticleReferencesProps): JSX.Element {

    const generatePDF = (): void => {
        const doc = new JsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - margin * 2;
        let y = 20;
        const lineSpacing = (fontSize: number): number => fontSize * 0.5;
        const bottomMargin = 20;
        const checkAddPage = (neededHeight: number): void => {
            if (y + neededHeight > pageHeight - bottomMargin) {
                doc.addPage();
                y = margin;
            }
        };
        let prevType: string | null = null;
        messages.forEach((msg, idx) => {
            let fontSize = 12;
            let color = [0, 0, 0];
            let extraSpacing = 0;
            // If current is title or subtitle and previous is text, use smaller spacing
            if ((msg.type === 'title' || msg.type === 'subtitle') && prevType === 'text') {
                extraSpacing = 11; // Small space before a title/subtitle if previous is text
            }
            if (msg.type === 'subtitle' && prevType === 'title') {
                extraSpacing = 9; // Small space before a subtitle if previous is title
            }

            if (extraSpacing > 0) {
                y += extraSpacing;
            }
            switch (msg.type) {
                case 'title':
                    fontSize = 20;
                    color = [128, 0, 128]; // Purple
                    break;
                case 'subtitle':
                    fontSize = 16;
                    color = [128, 0, 128];
                    break;
                case 'text':
                    fontSize = 11;
                    color = [0, 0, 0];
                    break;
                case 'code':
                    fontSize = 10;
                    color = [40, 40, 180];
                    break;
                default:
                    break;
            }
            doc.setFontSize(fontSize);
            if (color.length === 3) {
                doc.setTextColor(color[0], color[1], color[2]);
            }
            const lines = doc.splitTextToSize(msg.content, maxWidth);
            const neededHeight = lines.length * lineSpacing(fontSize);
            checkAddPage(neededHeight);
            doc.text(lines, margin, y);
            y += neededHeight;
            // Reset color for next message
            if (msg.type === 'code' || msg.type === 'title' || msg.type === 'subtitle') doc.setTextColor(0, 0, 0);
            prevType = msg.type;
        });
        // Add references
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const refTitle = doc.splitTextToSize('', maxWidth);
        let neededHeight = refTitle.length * lineSpacing(12);
        checkAddPage(neededHeight);
        doc.text(refTitle, margin, y);
        y += neededHeight;
        references.forEach((ref, idx) => {
            const refLines = doc.splitTextToSize(`${idx + 1}. ${ref}`, maxWidth);
            neededHeight = refLines.length * lineSpacing(12);
            checkAddPage(neededHeight);
            doc.text(refLines, margin, y);
            y += neededHeight;
        });
        // Save PDF
        doc.save(articleName + '.pdf');
    };

    return (
        <div onClick={generatePDF}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
            </svg>
        </div>
    );
};