import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";

export default function BreadcrumbGroup({
  title,
}: Readonly<{ title: string }>) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const visiblePathnames = pathnames.slice(0, -2);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visiblePathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <Fragment key={to}>
              <BreadcrumbItem>
                <>
                  <BreadcrumbLink asChild to={to}>
                    {capitalizeFirstLetter(value)}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
