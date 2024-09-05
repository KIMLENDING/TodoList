'use client';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import React, { useEffect, useState } from 'react';
import { AttachmentFileProps, UploadResult } from '@/types/types';
import { ClipLoader } from 'react-spinners'; // 로딩 스피너
import { Input } from '../ui/input';
import Image from 'next/image';

const AttachmentFile = ({ onUploadComplete }: AttachmentFileProps) => {
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);
    const getFileUrl = useMutation(api.todos.getUrl);

    // 파일 변경 이벤트 핸들러
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFiles(files);
    };

    // 파일 업로드 핸들러
    const handleUpload = async (): Promise<UploadResult> => {
        setLoading(true);
        setError(null);
        if (selectedFiles.length === 0) {
            setLoading(false);
            return { urls: [], storageIds: [], types: [], names: [] };
        }

        try {
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
        } catch (e) {
            console.error('파일 업로드 실패:', e);
            setError('파일 업로드 중 문제가 발생했습니다.');
            return { urls: [], storageIds: [], types: [], names: [] };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        onUploadComplete(handleUpload);
    }, [handleUpload]);

    return (
        <section className='flex flex-col'>
            <div className="image_div h-full" onClick={() => fileRef?.current?.click()}>
                <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileRef}
                />
                <div className='max-h-[200px] overflow-y-auto'>
                    {selectedFiles.length > 0 ? (
                        <ul className="w-full space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <div className="flex flex-col items-center gap-1">
                                <Image src="/icons/file-up.svg" width={40} height={40} alt="upload" />
                                <h2 className="text-12 font-bold text-orange-1">
                                    Click to upload
                                </h2>
                                <p className="text-12 font-normal text-gray-1"> PNG, JPG, GIF, PDF, XML, HWP... </p>
                            </div>
                        </div>)}
                </div>

                {loading && <ClipLoader color="#4A90E2" loading={loading} size={35} />}
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

        </section>
    );
};

export default AttachmentFile;
