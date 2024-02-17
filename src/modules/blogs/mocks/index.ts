import {BlogViewModel} from "../models/BlogViewModel";
import {BlogInputModel} from "../models/BlogInputModel";

export const testBlog: BlogViewModel = {
    id: '666777',
    name: 'It-Incubator',
    description: 'Our blog about education in IT community',
    websiteUrl: 'https://it-incubator.io/',
}

export const testBlogInput: BlogInputModel = {
    name: 'New blog name',
    description: 'New blog description',
    websiteUrl: 'https://new-site-url.com/',
}

export const testUpdateBlogInput: BlogInputModel = {
    name: 'Upd blog name',
    description: 'Update blog description',
    websiteUrl: 'https://update-site-url.com/',
}