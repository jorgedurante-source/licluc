import PostEditor from "@/components/admin/PostEditor";
import { createPost } from "../actions";

export default function NewPostPage() {
  return <PostEditor action={createPost} />;
}
