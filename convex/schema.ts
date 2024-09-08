import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    todos: defineTable({ // todo 테이블
        user: v.id('users'),    // 유저 아이디
        todoTitle: v.string(),   // todo 제목
        todoDescription: v.optional(v.string()), // todo 설명
        dueDate: v.optional(v.object({ from: v.optional(v.number()), to: v.optional(v.number()) })), // 기한 

        author: v.string(), //  users 테이블의 name
        authorId: v.string(), // users 테이블의 clerkId
        authorImageUrl: v.string(), // users 이미지 URL

        attachments: v.optional(v.object({
            attachmentUrls: v.optional(v.array(v.string())), // 첨부파일 URL
            attachmentid: v.optional(v.array(v.id('_storage'))), // 첨부파일
            attachmentTypes: v.optional(v.array(v.string())), // 첨부파일 타입
            attachmentNames: v.optional(v.array(v.string())), // 첨부파일 이름
        })),

        priority: v.optional(v.string()), // 우선순위 // 상, 중, 하
        category: v.optional(v.string()), // 카테고리
        tags: v.optional(v.array(v.string())), // 태그

        reminder: v.optional(v.number()), // 리마인더 알림설정 (시간)
        repeatType: v.optional(v.string()), //  repeatType: '매일||매주||매달||매년' // 반복 설정
        progress: v.optional(v.number()), // 진행 상황 // 0 ~ 100 % 이건 안 씀  굳이 필요없는것 같다 (이유 - 프론트에서 날짜 데이터 받아서 계산해서 보여주면 됨)

        isCompleted: v.string(), // 완료 여부 // 완료, 진행중, 실패
        completedAt: v.optional(v.number()), // 완료 시간 (시간)
    })
        .searchIndex('search_title', { searchField: 'todoTitle' }) // 검색 인덱스 todoTitle 필드
        .searchIndex('search_Description', { searchField: 'todoDescription' }) // 검색 인덱스 todoDescription 필드
        .searchIndex('search_Completed', { searchField: 'isCompleted' }) // 검색 인덱스 isCompleted 필드

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