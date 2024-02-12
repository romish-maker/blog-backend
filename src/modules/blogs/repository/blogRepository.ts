import {BlogViewModel} from "../models/BlogViewModel";
import {BlogInputModel} from "../models/BlogInputModel";

export const db: { blogs: BlogViewModel[] } = {
    blogs: [
        {id: "2002", name: "romish", description: "hi, this is my blog", "websiteUrl": "https://google.com"}
    ]
}
export const blogRepository = {
    getAllBlogs() {
        return db.blogs
    },
    createNewBlog(payload: BlogInputModel): BlogViewModel {
        const newBlog = {
            id: String(new Date()),
            ...payload
        }

        db.blogs.push(newBlog)
        return newBlog
    },
    getBlogById(blogId: string) {
        return db.blogs.find(blog => blog.id === blogId)
    },
    updateBlogById(blogId: string, payload: BlogInputModel) {
        const foundBlog = this.getBlogById(blogId);

        if (!foundBlog) {
            return false
        }

        db.blogs = db.blogs.map(blog => blog.id === blogId ? {...blog, ...payload} : blog)

        return true
    },
    deleteBlogById(blogId: string) {
        const foundBlog = this.getBlogById(blogId)

        if (!foundBlog) {
            return false
        }

        db.blogs = db.blogs.filter(blog => blog.id !== blogId)

        return true
    }
}