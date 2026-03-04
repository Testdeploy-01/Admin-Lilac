import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <a href={item.link} key={item.link} className="block h-full w-full p-2">
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("card-gray-gradient h-full w-full overflow-hidden rounded-2xl border border-border p-4", className)}>
      <div className="p-4">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <h4 className={cn("mt-2 font-bold tracking-wide text-foreground", className)}>{children}</h4>;
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <p className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", className)}>{children}</p>;
};
