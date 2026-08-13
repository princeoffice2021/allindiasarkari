import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { getPostByIdAdmin } from '../../lib/postsService';
import { updateSEO } from '../../lib/seo';
import { CategoryBadge } from '../../components/CategoryBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ShareButtons } from '../../components/ShareButtons';
import { AdSlot } from '../../components/AdSlot';
import { Sidebar } from '../../components/Sidebar';
import { Calendar, Clock, MapPin, Eye, Edit, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AdminPostPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') !== 'true') {
      navigate('/admin/login');
      return;
    }

    if (id) {
      getPostByIdAdmin(id).then((p) => {
        setPost(p);
        if (p) {
          updateSEO({
            title: `[PREVIEW] ${p.title}`,
            description: p.excerpt,
            noindex: true,
          });
        }
        setLoading(false);
      });
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-600">Loading Preview...</div>;
  }

  if (!post) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-red-600 font-bold">Article not found for preview.</p>
        <Link to="/admin/posts" className="text-xs font-bold text-blue-900 underline">
          Return to Admin Posts
        </Link>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className="space-y-6">
      {/* Top Admin Notice Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-400 text-blue-950 p-4 rounded-xl shadow-md font-black text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-900" />
          <span>
            ADMIN PREVIEW MODE — Article Status:{' '}
            <span className="uppercase underline font-mono">
              {post.published ? 'PUBLISHED' : 'DRAFT (Hidden from Public)'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/posts/${post.id}/edit`}
            className="bg-blue-950 text-white px-3 py-1.5 rounded-md hover:bg-blue-900 flex items-center gap-1"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Article
          </Link>
          <Link
            to="/admin/posts"
            className="bg-slate-900/10 text-blue-950 px-3 py-1.5 rounded-md hover:bg-slate-900/20 flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to List
          </Link>
        </div>
      </div>

      {/* Render exact public post layout */}
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Breadcrumbs category={post.category} state={post.state} postTitle={post.title} />

          <header className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.category} />
              {post.state && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <MapPin className="h-3 w-3 text-blue-800" />
                  {post.state} Jobs
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-800" />
                Published:{' '}
                {new Date(post.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-blue-800" />
                Last Updated:{' '}
                {new Date(post.updated_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </header>

          <AdSlot format="horizontal" label="Advertisement" />

          {post.image_url && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div
              className="article-content overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <ShareButtons title={post.title} url={currentUrl} />
        </div>

        <aside className="lg:col-span-4">
          <Sidebar currentCategory={post.category} />
        </aside>
      </article>
    </div>
  );
};
