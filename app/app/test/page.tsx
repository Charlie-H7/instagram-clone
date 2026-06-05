// "use client";

// import { useState, useCallback } from "react";
// import Child from "./testComp/Child";

// export default function Page() {
//   const [count, setCount] = useState(0);

//   // ❌ NO useCallback
//   const handleClick = () => {
//     console.log(`count inside handler: ${count}`);
//     // console.log(count);
//   };

//   return (
//     <div className="max-w-xl mx-auto">
//       <h1>Count: {count}</h1>

//       <button onClick={() => setCount(count + 1)}>
//         Increment
//       </button>

//       <Child onClick={handleClick} />
//     </div>
//   );
// }

//--------

// "use client";

// import { useState, useCallback } from "react";
// import Child from "./testComp/Child";

// export default function Page() {
//   const [count, setCount] = useState(0);

//   // ❌ WRONG useCallback usage
//   const handleClick = useCallback(() => {
//     console.log("count inside handler:", count);
//   }, []); // <- empty deps (this is the trap)

//   return (
//     <div className="max-w-xl mx-auto">
//       <h1>Count: {count}</h1>

//       <button onClick={() => setCount(count + 1)}>
//         Increment
//       </button>

//       <Child onClick={handleClick} />
//     </div>
//   );
// }

// -----


"use client";

import { useState, useCallback } from "react";
import Child from "./testComp/Child";

export default function Page() {
  const [count, setCount] = useState(0);

  // ❌ WRONG useCallback usage
  const handleClick = useCallback(() => {
      setCount(count + 1)
      console.log("count inside handler:", count);
  }, [count]); // <- empty deps (this is the trap)

  return (
    <div className="max-w-xl mx-auto">
    {/* {console.log(`Dom Count ${count}`)} */}
      <h1>Count: {count}</h1>

      <button onClick={handleClick}>
        Increment
      </button>

      <Child onClick={handleClick} />
    </div>
  );
}