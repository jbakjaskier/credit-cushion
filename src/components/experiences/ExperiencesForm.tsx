"use client";

import { validateExperienceForm } from "@/app/(application)/experiences/(addExperiences)/actions";
import { useActionState, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: null,
  },
];

const supportedPlatforms = [
  {
    name: "Rezdy",
    description: "An experience hosted and booked on Rezdy",
    imageUrl: "/external_logos/rezdy_logo.webp",
    radioId: "rezdy-radio",
    radioValue: "rezdy",
  },
  {
    name: "FareHarbour",
    description: "Experiences Managed by FareHarbour",
    imageUrl: "/external_logos/fareharbour_logo.png",
    radioId: "fareharbour-radio",
    radioValue: "fareharbour",
  },
];

export function ExperiencesForm() {
  const [state, formAction, isPending] = useActionState(
    validateExperienceForm,
    {
      mode: "initial",
    }
  );

  const [selectedPlatform, setSelectedPlatform] = useState<string>("rezdy");

  const TextInputUi = (
    <input
      type="search"
      name="url"
      id="url"
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      placeholder={
        selectedPlatform === "rezdy"
          ? `Search for your experiences on Rezdy`
          : `Short name in FareHarbour`
      }
      defaultValue={
        state.mode === "initial" || state.mode === "success"
          ? undefined
          : state.input
      }
      aria-invalid={
        state.mode === "initial" || state.mode === "success"
          ? undefined
          : "true"
      }
      aria-describedby={
        state.mode === "initial" || state.mode === "success"
          ? undefined
          : "url-error"
      }
    />
  );

  return (
    <>
      <form action={formAction}>
        <div className="space-y-12">
          <fieldset>
            <div className="mt-6 space-y-6">
              <ul
                role="list"
                className="mt-4 divide-y divide-gray-200  border-t border-gray-200"
              >
                {supportedPlatforms.map((platform, platformIdx) => (
                  <li
                    key={platformIdx}
                    className="flex items-center justify-between space-x-3 py-4 last:border-b-0"
                  >
                    <input
                      id={platform.radioId}
                      name="platform"
                      type="radio"
                      value={platform.radioValue}
                      checked={selectedPlatform === platform.radioValue}
                      onChange={(event) => {
                        setSelectedPlatform(event.target.value);
                      }}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <div className="flex min-w-0 flex-1 items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Image
                          width={80}
                          height={80}
                          src={platform.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {platform.name}
                        </p>
                        <p className="truncate text-sm font-medium text-gray-500">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0"></div>
                  </li>
                ))}
              </ul>
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex">
          <label htmlFor="url" className="sr-only">
            {selectedPlatform === "rezdy"
              ? `Search Term for Rezdy`
              : `Short Name for FareHarbour`}
          </label>

          {state.mode === "error" ? (
            <div className="relative block w-full rounded-md shadow-sm">
              {TextInputUi}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          ) : (
            TextInputUi
          )}

          {isPending ? (
            <div
              className=" ml-4 mt-1 flex-shrink-0 animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="ml-4 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 self-center"
            >
              {`Go`}
            </button>
          )}
        </div>
        {state.mode === "error" && (
          <p className="mt-2 ml-1 text-sm text-red-600" id="url-error">
            {state.errorMessage}
          </p>
        )}
      </form>
      <ul role="list" className="divide-y divide-gray-100 mt-4">
        {people.map((person) => (
          <li
            key={person.email}
            className="relative flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={person.imageUrl}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <a href={person.href}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {person.name}
                  </a>
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  <a
                    href={`mailto:${person.email}`}
                    className="relative truncate hover:underline"
                  >
                    {person.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{person.role}</p>
                {person.lastSeen ? (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last seen{" "}
                    <time dateTime={person.lastSeenDateTime}>
                      {person.lastSeen}
                    </time>
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
                )}
              </div>
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
//TODO: Add Experience list here
