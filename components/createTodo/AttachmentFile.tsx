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
        if (selectedFiles.length === 0) return { urls: [], storageIds: [], types: [], names: [] };
        console.log('handleUpload');
        const uploaded = await startUpload(selectedFiles);
        console.log('uploaded', uploaded);
        const storageIds = uploaded.map(({ response }: any) => response.storageId);
        const types = uploaded.map(({ type }: any) => type);
        const names = uploaded.map(({ name }: any) => name);

        const urlsAndIds = await Promise.all(
            storageIds.map(async (storageId, index) => {
                const url: any = await getFileUrl({ storageId });
                return { storageId, url, type: types[index], name: names[index] };
            })
        );

        const urls = urlsAndIds.map(({ url }) => url);
        const ids = urlsAndIds.map(({ storageId }) => storageId);
        const typ = urlsAndIds.map(({ type }) => type);
        const nams = urlsAndIds.map(({ name }) => name);


        return { urls, storageIds: ids, types: typ, names: nams };
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
