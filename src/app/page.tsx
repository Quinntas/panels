'use client'
import {Document, Page, pdfjs} from 'react-pdf';
import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
// @ts-expect-error asd
import {DocumentCallback} from "react-pdf/src/shared/types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export const dynamic = 'force-static';

export default function PDFReader() {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [jumpToPage, setJumpToPage] = useState<string>('');
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    function calculateDimensions() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const padding = 0; // Adjust padding as needed

        return {
            width: screenWidth - padding,
            height: screenHeight - padding
        };
    }

    function onDocumentLoadSuccess(docCallback: DocumentCallback): void {
        setNumPages(docCallback.numPages);
        setDimensions(calculateDimensions());
    }

    // Update dimensions on window resize
    useEffect(() => {
        const handleResize = () => {
            setDimensions(calculateDimensions());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const page = Math.floor(window.scrollY / window.innerHeight) + 1;
            setCurrentPage(page);
        });
        return () => {
            window.removeEventListener('scroll', () => {
            });
        };
    }, []);

    const handleJumpToPage = () => {
        const pageNum = parseInt(jumpToPage);
        if (pageNum && pageNum >= 1 && pageNum <= numPages) {
            document.getElementById(`page-${pageNum}`)?.scrollIntoView({behavior: 'smooth'});
            setCurrentPage(pageNum);
            setJumpToPage('');
        }
    }

    return (
        <div className="flex flex-col">
            {/* Custom Controls */}
            <div className="flex flex-col gap-5 p-4 sticky top-0 z-10 bg-white">
                {/* Page Navigation */}
                <div className="flex gap-2 items-center">
                    <div className={"flex flex-col gap-2"}>
                        <span className="px-4 py-2">Total Pages: {numPages}</span>
                        <span className="px-4 py-2">Current Page: {currentPage}</span>
                    </div>

                    {/* Jump to Page */}
                    <div className="flex items-center gap-2 ml-4">
                        <Input
                            type="number"
                            min="1"
                            max={numPages}
                            value={jumpToPage}
                            onChange={(e) => setJumpToPage(e.target.value)}
                        />
                        <Button onClick={handleJumpToPage}>
                            Go
                        </Button>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex gap-2">
                    <Button onClick={() => setScale(scale => scale - 0.1)}>
                        Zoom Out
                    </Button>
                    <span className="px-4 py-2">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button onClick={() => setScale(scale => scale + 0.1)}>
                        Zoom In
                    </Button>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="overflow-auto">
                <Document
                    file="/files/one-piece-01.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center gap-1"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div
                            key={`page_${index + 1}`}
                            id={`page-${index + 1}`}
                            className="flex-shrink-0"
                        >
                            <Page
                                pageNumber={index + 1}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                width={dimensions.width}
                                height={dimensions.height}
                            />
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}