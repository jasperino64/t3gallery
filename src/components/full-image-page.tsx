import { getMyImage } from "~/server/queries";

export default async function FullPageImageView(props: { id: number }) {
  const image = await getMyImage(props.id);
  return (
    <div className="flex h-full w-full min-w-0">
      <div className="flex flex-shrink items-center justify-center border-white">
        <img src={image.url} className="object-contain" />
      </div>
      <div className="flex w-80 flex-col p-4">
        <div className="text-2xl font-bold">{image.name}</div>
      </div>
    </div>
  );
}
