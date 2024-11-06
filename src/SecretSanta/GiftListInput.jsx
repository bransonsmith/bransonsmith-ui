


export default function GiftListInput({ label, id, value, onChange, onBlur }) {


      return (
        <div className="flex flex-col w-full mr-auto">
          <label className="w-[96%] mx-auto mt-3 mb-1" htmlFor={id}>
            {label}
          </label>
          <textarea
            className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
            rows="6"
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        </div>
      );
}
