import React, { useMemo } from 'react';

interface MarkdownProps {
  text: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function processInline(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return result;
}

export default function Markdown({ text }: MarkdownProps) {
  const html = useMemo(() => {
    const lines = text.split(/\r?\n/);
    const out: string[] = [];
    let inOl = false;
    let inUl = false;
    let paragraph: string[] = [];

    const closeLists = () => {
      if (inOl) {
        out.push('</ol>');
        inOl = false;
      }
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
    };

    const flushParagraph = () => {
      if (paragraph.length > 0) {
        out.push('<p>' + processInline(paragraph.join(' ')) + '</p>');
        paragraph = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.replace(/\s+$/, '');
      if (/^\d+\.\s+/.test(line)) {
        flushParagraph();
        if (!inOl) {
          closeLists();
          out.push('<ol>');
          inOl = true;
        }
        out.push('<li>' + processInline(line.replace(/^\d+\.\s+/, '')) + '</li>');
      } else if (/^[-*]\s+/.test(line)) {
        flushParagraph();
        if (!inUl) {
          closeLists();
          out.push('<ul>');
          inUl = true;
        }
        out.push('<li>' + processInline(line.replace(/^[-*]\s+/, '')) + '</li>');
      } else if (/^###\s+/.test(line)) {
        flushParagraph();
        closeLists();
        out.push('<h3>' + processInline(line.slice(4)) + '</h3>');
      } else if (/^##\s+/.test(line)) {
        flushParagraph();
        closeLists();
        out.push('<h2>' + processInline(line.slice(3)) + '</h2>');
      } else if (/^#\s+/.test(line)) {
        flushParagraph();
        closeLists();
        out.push('<h1>' + processInline(line.slice(2)) + '</h1>');
      } else if (line.trim() === '') {
        flushParagraph();
        closeLists();
      } else {
        paragraph.push(line);
      }
    }

    flushParagraph();
    closeLists();

    return out.join('');
  }, [text]);

  return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: html }} />;
}
