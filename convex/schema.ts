import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    todos: defineTable({ // todo 테이블
        user: v.id('users'),    // 유저 아이디
        todoTitle: v.string(),   // todo 제목
        todoDescription: v.string(), // todo 설명
        dueDate: v.number(), // 기한 

        author: v.string(), //  users 테이블의 name
        authorId: v.string(), // users 테이블의 clerkId
        authorImageUrl: v.string(), // users 이미지 URL

        attachmentUrls: v.optional(v.array(v.string())), // 첨부파일 URL
        attachments: v.optional(v.array(v.id('_storage'))), // 첨부파일

        priority: v.optional(v.string()), // 우선순위 // 상, 중, 하
        category: v.optional(v.string()), // 카테고리
        tags: v.optional(v.array(v.string())), // 태그

        reminder: v.optional(v.number()), // 리마인더 알림설정 (시간)
        // repeat: v.optional(v.boolean()), // 반복 설정
        progress: v.optional(v.number()), // 진행 상황 // 0 ~ 100 %

        isCompleted: v.boolean(), // 완료 여부 // true, false
        completedAt: v.optional(v.number()), // 완료 시간 (시간)
    })
        .searchIndex('search_author', { searchField: 'author' }) // 검색 인덱스 author 필드
        .searchIndex('search_title', { searchField: 'todoTitle' }) // 검색 인덱스 todoTitle 필드
        .searchIndex('search_Description', { searchField: 'todoDescription' }) // 검색 인덱스 todoDescription 필드
    ,
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