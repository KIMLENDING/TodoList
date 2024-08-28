'use client';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import React, { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { AttachmentFileProps, UploadResult } from '@/types/types';


const AttachmentFile = ({ onUploadComplete }: AttachmentFileProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);
    const getFileUrl = useMutation(api.todos.getUrl);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFiles(files);
    };

    const handleUpload = async (): Promise<UploadResult> => {
        if (selectedFiles.length === 0) return { urls: [], storageIds: [] };
        console.log('handleUpload');
        const uploaded = await startUpload(selectedFiles);
        const storageIds = uploaded.map(({ response }: any) => response.storageId);

        const urlsAndIds = await Promise.all(
            storageIds.map(async (storageId) => {
                const url: any = await getFileUrl({ storageId });
                return { storageId, url };
            })
        );

        const urls = urlsAndIds.map(({ url }) => url);
        const ids = urlsAndIds.map(({ storageId }) => storageId);


        return { urls, storageIds: ids };
    };
    useEffect(() => {
        onUploadComplete(handleUpload);
    }, [handleUpload]);

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
        </div>
    );
}

export default AttachmentFile;
