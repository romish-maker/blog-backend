import {PostViewModel} from "../models/PostViewModel";
import {PostInputModel} from "../models/PostInputModel";
import {blogRepository} from "../../blogs/repository/blogRepository";

export const db: { posts: PostViewModel[] } = {
    posts: [
        {
            id: '2002',
            title: 'Express',
            shortDescription: 'Why is so hard to find a job in 2024',
            content: 'VERY VERY LONG CONTENT HERE',
            blogId: '2002',
            blogName: 'romish-kuvatov',
        }
    ]
}
export const postsRepository = {
    getAllPosts() {
        return db.posts
    },
    createNewPost(payload: PostInputModel) {
        const blogData = blogRepository.getBlogById(payload.blogId)

        if (!blogData) {
            return false
        }

        const newPost = {
            id: String(new Date()),
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: blogData?.name,
        }

        db.posts.push(newPost)
        return newPost
    },
    getPostById(postId: string) {
        return db.posts.find(blog => blog.id === postId)
    },
    updatePostById(payload: PostInputModel, postId: string) {
        const blogData = blogRepository.getBlogById(payload.blogId)
        const updatingPost = this.getPostById(postId)

        if (!updatingPost || !blogData) {
            return false
        }

        updatingPost.blogId = payload.blogId
        updatingPost.title = payload.title
        updatingPost.shortDescription = payload.shortDescription
        updatingPost.content = payload.content
        updatingPost.blogName = blogData.name

        return true
    },
    deletePostById(postId: string) {
        const deletingPost = this.getPostById(postId)

        if (!deletingPost) {
            return false
        }

        db.posts = db.posts.filter((post) => post.id !== postId)

        return true
    }
}