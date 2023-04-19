import React, {useEffect} from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';

export default function breadCrumb(props) {

    const router                        = useRouter();
    const pathnames                     = router.pathname.split(`/`).filter(x => x);
    const hiddenPaths = ['auth','results']
    function isLast(index) {
        return index === props.crumbs.length - 1;
    }

  return (
    <div className='bread-crumb'>
        <nav className="container d-flex align-items-center">
            {
                pathnames.length > 0 ? (
                    <Link href={'/'} className='link-head'><i className='icon-home'></i></Link>
                ) : (
                    <Link href={'/'} className='link-head'><i className='icon-home'></i></Link>
                )
            }
            {
                pathnames.map((name, index) => {
                    const routeTo   = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast    = index === pathnames.length - 1;
                    return isLast ? (
                        <a key={name} className='link-head'>{name.split('-').join(' ')}</a>
                    ) : (
                        !hiddenPaths.includes(name) && <Link className='link-head' href={`${routeTo}`} key={name} onClick={() => router.push(routeTo)}>
                            {name.split('-').join(' ')}
                        </Link>
                    );
                })
        }
        </nav>
    </div>
  )
}