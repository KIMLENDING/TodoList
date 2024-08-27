import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    todos: defineTable({ // todo 테이블
        user: v.id('users'),    // 유저 아이디
        todoTitle: v.string(),   // todo 제목
        todoDescription: v.string(), // todo 설명

        audioUrl: v.optional(v.string()), // 오디오 파일 URL
        audioDuration: v.number(), // 오디오 길이
        audioStorageId: v.optional(v.id('_storage')), // 오디오 파일 저장소 아이디

        imageUrl: v.optional(v.string()), // 이미지 URL
        imageStorageId: v.optional(v.id('_storage')), // 이미지 저장소 아이디

        author: v.string(), //  users 테이블의 name
        authorId: v.string(), // users 테이블의 clerkId
        authorImageUrl: v.string(), // users 이미지 URL

    })
        .searchIndex('search_author', { searchField: 'author' }) // 검색 인덱스 author 필드
        .searchIndex('search_title', { searchField: 'todoTitle' }) // 검색 인덱스 todoTitle 필드
        .searchIndex('search_body', { searchField: 'todoDescription' }), // 검색 인덱스 todoDescription 필드
    users: defineTable({
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
    }),

},
    {
        strictTableNameTypes: false, // 테이블 이름을 문자열로만 사용
    },
);