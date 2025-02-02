import React, { createContext, useState, useEffect, useContext } from 'react'
import { Alert } from 'react-bootstrap'
import { BlogInterface } from '../../Interfaces/BlogInterface';
import BlogContent from './BlogContent';

import "./Blog.css";
import BlogEditorButtons from './BlogEditorButtons';
import BlogSave from './BlogSave';
import { StaticContext } from '../../Contexts/StaticContext';
import { Link } from 'react-router-dom';
import { useQuery, useWindowSize } from '../../Utils/Hooks';
import Loading from '../Loading';

export interface EditorSettings {
    isEditor:boolean
}

interface BlogContextInterface {
    blogPost:BlogInterface|null,
    setBlogPost:(post:BlogInterface) => void
}

export const BlogContext = createContext<BlogContextInterface>(
    {
        blogPost:null,
        setBlogPost:()=>{}
    }
);

export interface Props{
    edit:boolean
}

/*
{
    title:"First blog post",
    author:"HawaiiDev",
    publishDate:Date.now(),
    language:"EN",        
    content:[
        {
            title:"Chapter 1",
            imgLeft:{
                link:"https://unsplash.it/200/500",
                sizeX:"450px",
                sizeY:"500px",
                alt:"Random Image"
            },
            imgRight:{
                link:"https://unsplash.it/500/500",
                sizeX:"500px",
                sizeY:"400px",
                alt:"Random Image"
            },
            text:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae vitae ex velit temporibus error non totam facilis possimus qui labore commodi fugit officiis voluptatibus, harum tempora unde optio illum explicabo eaque consequatur laudantium magni assumenda! In fugit tenetur deleniti architecto repellat veniam incidunt ipsam eaque ab nisi doloremque quae quidem laudantium facere, voluptate sed earum consequatur culpa laboriosam praesentium minima? Odio ab repudiandae quidem at, nulla modi ullam, consectetur voluptatum assumenda exercitationem atque quisquam temporibus veritatis alias voluptatem numquam. Rem voluptatem placeat molestias non eaque! Dolores adipisci ratione unde ea non earum sed, velit omnis. Ratione laboriosam dolore voluptatum laborum dicta, incidunt alias minus eaque quidem ducimus maxime atque, voluptates repudiandae esse asperiores temporibus rem ab? Eligendi doloremque a voluptas molestias ducimus architecto nemo placeat perspiciatis. Beatae ut dolorum corporis quis id debitis aperiam culpa cumque alias consectetur totam, esse perferendis necessitatibus ex vel quo eaque! Numquam consectetur ex inventore rerum veritatis distinctio in ducimus eum, blanditiis fugit sint eos accusantium culpa ipsa necessitatibus accusamus voluptatibus. Culpa sint laboriosam quos ipsum quaerat quisquam saepe autem voluptatum veniam fuga sapiente officiis reprehenderit incidunt illum minima ut sed neque animi beatae deserunt, aut accusantium quod maxime vitae? Quam explicabo fuga et quidem"
        },
        {
            title:"Chapter 1",
            imgLeft:{
                link:"https://unsplash.it/200/500",
                sizeX:"1000px",
                sizeY:"400px",
                alt:"Random Image"
            },
            imgRight:null,
            text:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae vitae ex velit temporibus error non totam facilis possimus qui labore commodi fugit officiis voluptatibus, harum tempora unde optio illum explicabo eaque consequatur laudantium magni assumenda! In fugit tenetur deleniti architecto repellat veniam incidunt ipsam eaque ab nisi doloremque quae quidem laudantium facere, voluptate sed earum consequatur culpa laboriosam praesentium minima? Odio ab repudiandae quidem at, nulla modi ullam, consectetur voluptatum assumenda exercitationem atque quisquam temporibus veritatis alias voluptatem numquam. Rem voluptatem placeat molestias non eaque! Dolores adipisci ratione unde ea non earum sed, velit omnis. Ratione laboriosam dolore voluptatum laborum dicta, incidunt alias minus eaque quidem ducimus maxime atque, voluptates repudiandae esse asperiores temporibus rem ab? Eligendi doloremque a voluptas molestias ducimus architecto nemo placeat perspiciatis. Beatae ut dolorum corporis quis id debitis aperiam culpa cumque alias consectetur totam, esse perferendis necessitatibus ex vel quo eaque! Numquam consectetur ex inventore rerum veritatis distinctio in ducimus eum, blanditiis fugit sint eos accusantium culpa ipsa necessitatibus accusamus voluptatibus. Culpa sint laboriosam quos ipsum quaerat quisquam saepe autem voluptatum veniam fuga sapiente officiis reprehenderit incidunt illum minima ut sed neque animi beatae deserunt, aut accusantium quod maxime vitae? Quam explicabo fuga et quidem"
        },
        {
            title:"Chapter 1",
            imgLeft:null,
            imgRight:{
                link:"https://unsplash.it/500/500",
                sizeX:"500px",
                sizeY:"400px",
                alt:"Random Image"
            },
            text:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae vitae ex velit temporibus error non totam facilis possimus qui labore commodi fugit officiis voluptatibus, harum tempora unde optio illum explicabo eaque consequatur laudantium magni assumenda! In fugit tenetur deleniti architecto repellat veniam incidunt ipsam eaque ab nisi doloremque quae quidem laudantium facere, voluptate sed earum consequatur culpa laboriosam praesentium minima? Odio ab repudiandae quidem at, nulla modi ullam, consectetur voluptatum assumenda exercitationem atque quisquam temporibus veritatis alias voluptatem numquam. Rem voluptatem placeat molestias non eaque! Dolores adipisci ratione unde ea non earum sed, velit omnis. Ratione laboriosam dolore voluptatum laborum dicta, incidunt alias minus eaque quidem ducimus maxime atque, voluptates repudiandae esse asperiores temporibus rem ab? Eligendi doloremque a voluptas molestias ducimus architecto nemo placeat perspiciatis. Beatae ut dolorum corporis quis id debitis aperiam culpa cumque alias consectetur totam, esse perferendis necessitatibus ex vel quo eaque! Numquam consectetur ex inventore rerum veritatis distinctio in ducimus eum, blanditiis fugit sint eos accusantium culpa ipsa necessitatibus accusamus voluptatibus. Culpa sint laboriosam quos ipsum quaerat quisquam saepe autem voluptatum veniam fuga sapiente officiis reprehenderit incidunt illum minima ut sed neque animi beatae deserunt, aut accusantium quod maxime vitae? Quam explicabo fuga et quidem"
        },
    ]
}
*/

function Blog({edit}:Props) {
    const [editorSettings, setEditorSettings] = useState<EditorSettings>({
        isEditor:edit
    });
    const [showSaveWindow, setShowSaveWindow] = useState(false);
    const [loading,setLoading] = useState(true);

    const [width] = useWindowSize();

    let query = useQuery();

    const [blogPost, setBlogPost] = useState<BlogInterface>({
        author:"",
        content:[],
        id:"",
        language:{
            code:"En",
            name:"English"
        },
        publishDate:0,
        lastUpdated:0,
        title:""
    });
    const [user, setUser] = useState("");
    
    const { apiEndPoint } = useContext(StaticContext);

    useEffect(()=>{
        const getBlog = async () => {
            if(blogPost.id === ""){
                const id = query.get("id");
                if(id === null){return;}

                var blog = await GetBlogWithID(id, apiEndPoint);
                var user = await fetch(`${apiEndPoint}/users/get/name/${blog.author}`,{
                    method:"GET"
                });

                setUser((await user.json()).name);
                setBlogPost(blog);
                setLoading(false);
            }
        }
        getBlog();
    },[apiEndPoint, blogPost.id, query]);

    const setPost = (post:BlogInterface) => {
        var temp:BlogInterface = {
            title:post.title,
            author:post.author,
            publishDate:post.publishDate,
            lastUpdated:post.lastUpdated,
            language:post.language,
            content:[...post.content],
            id:post.id
        }
        setBlogPost(temp);
    }

    const saveAll = () => {
        setShowSaveWindow(true);
    }

    if(loading){
        return (
            <Loading/>
        )
    }

    if(blogPost.id === ""){
        return(
            <div className='auto' style={{height:"90vh"}}>
                <h2 className="center">Error, hittade ingen blog</h2>
            </div>
        )
    }

    if(editorSettings.isEditor && width < 992){
        return(
            <div className="auto">
                <Alert className="Def4090 center" variant={"danger"}>
                    !! Varning !! Du kan inte redigera en blog om din skärms storlek är för liten
                </Alert>
                {editorSettings.isEditor && <BlogEditorButtons onlySave saveButtonPressed={saveAll} lastToggle={true} index={blogPost.content.length}/>}
                {editorSettings.isEditor && showSaveWindow && <BlogSave setShow={setShowSaveWindow}/>}
            </div>
        )
    }

    console.log("Render",{...blogPost});

    return (
        <div>
            <BlogContext.Provider value={{blogPost,setBlogPost:(b)=>{console.log({...b});setPost(b)}}}>
                <h1 className="center">{blogPost.title}</h1>
                <h5 className="center">
                    <Link to={`/?author=${blogPost.author}`}>{user}</Link> : {blogPost.language.name}
                </h5>
                <p className="center" style={{marginBottom:"0rem"}}>
                    Created at: {new Date(blogPost.publishDate).toLocaleString("sw-SW")}
                </p>
                <p className="center">
                    Last update: {new Date(blogPost.lastUpdated).toLocaleString("sw-SW")}    
                </p>

                {blogPost.content.map((item,index)=>{
                    return(
                        <BlogContent screenWidth={width} setEditorSettings={setEditorSettings} editorSettings={editorSettings} key={Math.random()*100} content={item} index={index} />
                    )
                })}
                {editorSettings.isEditor && <BlogEditorButtons onlySave={false} saveButtonPressed={saveAll} lastToggle={true} index={blogPost.content.length}/>}
                {editorSettings.isEditor && showSaveWindow && <BlogSave setShow={setShowSaveWindow}/>}
            </BlogContext.Provider>
        </div>
    )
}

function GetBlogWithID(id:string, apiEndPoint:string):Promise<BlogInterface>{
    const blog = fetch(`${apiEndPoint}/blog/${id}`,{
        method:"GET"
    }).then(res => res.json());

    return blog;
}

type CloudSaveType = (blogPost:BlogInterface, apiEndPoint:string,accessToken:string,updateRefresh:()=>Promise<string>) => Promise<BlogInterface>

export const CloudSave:CloudSaveType = async(blogPost,apiEndPoint,accessToken,updateRefresh)=> {
    var data = {
        blog:blogPost,
        id:blogPost.id
    }

    data.blog.lastUpdated = Date.now();
    
    var saveResult = await fetch(`${apiEndPoint}/blog/save`,{
        method:"POST",
        body: JSON.stringify(data),
        headers:{
            "Authorization":`Bearer ${accessToken}`,
            "Content-Type":"application/json"
        }
    });

    if(saveResult.status !== 200){
        accessToken = await updateRefresh();
        await fetch(`${apiEndPoint}/blog/save`,{
            method:"POST",
            body: JSON.stringify(data),
            headers:{
                "Authorization":`Bearer ${accessToken}`,
                "Content-Type":"application/json"
            }
        });
    }

    const newBlogPost = await saveResult.json();
    return newBlogPost;
}

export default Blog
