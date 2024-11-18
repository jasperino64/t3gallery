import { getMyImage } from "~/server/queries";

export default async function FullPageImageView(props: { id: number }) {
  const image = await getMyImage(props.id);
  return (
    <div className="flex w-full justify-center">
      <img src={image.url} className="w-96" />
    </div>
  );
}
